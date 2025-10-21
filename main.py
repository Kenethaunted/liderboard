from fastapi import FastAPI
import sqlite3
con = sqlite3.connect('films_db.sqlite')
cur = con.cursor()
app = FastAPI()
@app.get("/")
async def roma():
    return [i for i in cur.execute('select * from films where id < 51')]
#хуй



