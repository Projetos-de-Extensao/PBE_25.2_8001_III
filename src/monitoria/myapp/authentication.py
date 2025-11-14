from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    """
    Permite usar o header Authorization: Bearer <token>
    além do padrão do DRF (Authorization: Token <token>).
    """
    keyword = 'Bearer'
