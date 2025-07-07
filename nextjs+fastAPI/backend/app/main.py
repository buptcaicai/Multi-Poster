from fastapi import FastAPI
from core.config import settings

print('------settings------')
print(settings)
print('--------------------')

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World 123"}


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}


@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
