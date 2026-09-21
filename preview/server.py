import importlib.util
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
spec=importlib.util.spec_from_file_location('skills_library',Path(__file__).parent.parent/'dashboard/plugin_api.py')
api=importlib.util.module_from_spec(spec);spec.loader.exec_module(api)
app=FastAPI()
@app.middleware('http')
async def readonly(request,call_next):
    if request.method not in ('GET','HEAD'):
        return JSONResponse({'detail':'This browser preview is read-only. Install from the Hermes desktop tab.'},status_code=403)
    response = await call_next(request)
    response.headers['Cache-Control'] = 'no-store'
    return response
app.include_router(api.router,prefix='/api')
app.mount('/codicons',StaticFiles(directory=Path(__file__).parent.parent/'node_modules/@vscode/codicons/dist'),name='codicons')
app.mount('/',StaticFiles(directory=Path(__file__).parent,html=True),name='preview')
