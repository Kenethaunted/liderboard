from fastapi import APIRouter, Request, HTTPException
from authlib.integrations.starlette_client import OAuth
from starlette.responses import RedirectResponse
from starlette.config import Config
import os  # <-- Добавлено

config = Config('.env')

oauth = OAuth(config)
oauth.register(
    name='tpu',
    server_metadata_url='https://auth.tpu.ru/.well-known/openid_configuration',
    client_id=os.getenv('TPU_CLIENT_ID'),
    client_secret=os.getenv('TPU_CLIENT_SECRET'),
    client_kwargs={
        'scope': 'openid profile email'
    }
)

router = APIRouter()

@router.get('/auth/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.tpu.authorize_redirect(request, redirect_uri)

@router.get('/auth/callback')
async def auth_callback(request: Request):
    token = await oauth.tpu.authorize_access_token(request)
    user = token.get('userinfo')
    request.session['user'] = user
    return RedirectResponse('/')

@router.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse('/')