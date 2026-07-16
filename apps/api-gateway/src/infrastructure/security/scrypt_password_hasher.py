import hashlib
import hmac
import secrets

from src.domain.services.password_hasher import PasswordHasher


class ScryptPasswordHasher(PasswordHasher):
    _salt_size = 16
    _n = 2**14
    _r = 8
    _p = 1
    _dklen = 64

    def hash_password(self, password: str) -> str:
        salt = secrets.token_bytes(self._salt_size)
        digest = hashlib.scrypt(
            password.encode("utf-8"),
            salt=salt,
            n=self._n,
            r=self._r,
            p=self._p,
            dklen=self._dklen,
        )
        return f"{salt.hex()}:{digest.hex()}"

    def verify_password(self, password: str, password_hash: str) -> bool:
        try:
            salt_hex, digest_hex = password_hash.split(":", maxsplit=1)
        except ValueError:
            return False

        candidate_digest = hashlib.scrypt(
            password.encode("utf-8"),
            salt=bytes.fromhex(salt_hex),
            n=self._n,
            r=self._r,
            p=self._p,
            dklen=self._dklen,
        )
        return hmac.compare_digest(candidate_digest.hex(), digest_hex)

