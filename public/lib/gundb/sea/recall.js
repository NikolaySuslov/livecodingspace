
    const Buffer = require('./buffer')
    const authsettings = require('./settings')
    //const { scope: seaIndexedDb } = require('./indexed')
    const queryGunAliases = require('./query')
    const parseProps = require('./parse')
    const updateStorage = require('./update')
    const SEA = require('./sea')
    const Gun = SEA.Gun;
    const finalizeLogin = require('./login')

    // This internal func recalls persisted User authentication if so configured
    const authRecall = async (gunRoot, authprops) => {
      // window.sessionStorage only holds signed { alias, pin } !!!
      const remember = authprops || sessionStorage.getItem('remember')
      const { alias = sessionStorage.getItem('user'), pin: pIn } = authprops || {} // @mhelander what is pIn?
      const pin = pIn && Buffer.from(pIn, 'utf8').toString('base64')
      // Checks for existing proof, matching alias and expiration:
      const checkRememberData = async ({ proof, alias: aLias, iat, exp, remember }) => {
        if (!!proof && alias === aLias) {
          const checkNotExpired = (args) => {
            if (Math.floor(Date.now() / 1000) < (iat + args.exp)) {
              // No way hook to update 'iat'
              return Object.assign(args, { iat: iat, proof: proof })
            } else {
              Gun.log('Authentication expired!')
            }
          }
          // We're not gonna give proof to hook!
          const hooked = authsettings.hook({ alias: alias, iat: iat, exp: exp, remember: remember })
          return ((hooked instanceof Promise)
          && await hooked.then(checkNotExpired)) || checkNotExpired(hooked)
        }
      }
      const readAndDecrypt = async (data, pub, key) =>
        parseProps(await SEA.decrypt(await SEA.verify(data, pub), key))

      // Already authenticated?
      if (gunRoot._.user
      && Gun.obj.has(gunRoot._.user._, 'pub')
      && Gun.obj.has(gunRoot._.user._, 'sea')) {
        return gunRoot._.user._  // Yes, we're done here.
      }
      // No, got persisted 'alias'?
      if (!alias) {
        throw { err: 'No authentication session found!' }
      }
      // Yes, got persisted 'remember'?
      if (!remember) {
        throw {  // And return proof if for matching alias
          err: (await seaIndexedDb.get(alias, 'auth') && authsettings.validity
          && 'Missing PIN and alias!') || 'No authentication session found!'
        }
      }
      // Yes, let's get (all?) matching aliases
      const aliases = (await queryGunAliases(alias, gunRoot))
      .filter(({ pub } = {}) => !!pub)
      // Got any?
      if (!aliases.length) {
        throw { err: 'Public key does not exist!' }
      }
      let err
      // Yes, then attempt to log into each one until we find ours!
      // (if two users have the same username AND the same password... that would be bad)
      const [ { key, at, proof, pin: newPin } = {} ] = await Promise
      .all(aliases.filter(({ at: { put } = {} }) => !!put)
      .map(async ({ at: at, pub: pub }) => {
        const readStorageData = async (args) => {
          const props = args || parseProps(await SEA.verify(remember, pub, true))
          let pin = props.pin
          let aLias = props.alias

          const data = (!pin && alias === aLias)
          // No PIN, let's try short-term proof if for matching alias
          ? await checkRememberData(props)
          // Got PIN so get IndexedDB secret if signature is ok
          : await checkRememberData(await readAndDecrypt(await seaIndexedDb.get(alias, 'auth'), pub, pin))
          pin = pin || data.pin
          delete data.pin
          return { pin: pin, data: data }
        }
        // got pub, try auth with pin & alias :: or unwrap Storage data...
        const __gky20 = await readStorageData(pin && { pin, alias })
        const data = __gky20.data
        const newPin = __gky20.pin
        const proof = data.proof

        if (!proof) {
          if (!data) {
            err = 'No valid authentication session found!'
            return
          }
          try { // Wipes IndexedDB silently
            await updateStorage()(data)
          } catch (e) {}  //eslint-disable-line no-empty
          err = 'Expired session!'
          return
        }

        try { // auth parsing or decryption fails or returns empty - silently done
          const auth= at.put.auth.auth
          const sea = await SEA.decrypt(auth, proof)
          if (!sea) {
            err = 'Failed to decrypt private key!'
            return
          }
          const priv = sea.priv
          const epriv = sea.epriv
          const epub = at.put.epub
          // Success! we've found our private data!
          err = null
          return { proof: proof, at: at, pin: newPin, key: { pub: pub, priv: priv, epriv: epriv, epub: epub } }
        } catch (e) {
          err = 'Failed to decrypt private key!'
          return
        }
      }).filter((props) => !!props))

      if (!key) {
        throw { err: err || 'Public key does not exist!' }
      }

      // now we have AES decrypted the private key,
      // if we were successful, then that means we're logged in!
      try {
        await updateStorage(proof, key, newPin || pin)(key)

        const user = Object.assign(key, { at: at, proof: proof })
        const pIN = newPin || pin

        const pinProp = pIN && { pin: Buffer.from(pIN, 'base64').toString('utf8') }

        return await finalizeLogin(alias, user, gunRoot, pinProp)
      } catch (e) { // TODO: right log message ?
        Gun.log('Failed to finalize login with new password!')
        const { err = '' } = e || {}
        throw { err: 'Finalizing new password login failed! Reason: '+err }
      }
    }
    module.exports = authRecall
  