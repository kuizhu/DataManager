 # -*- coding: utf-8 -*
from flask import Flask, render_template, request
import numpy as np
import json
import pymongo
import time

innerIndicators={
    "体型":["手臂","腿部","腹部","臀部"],
    "视力":["左眼","右眼"],
    "皮肤":["肤色","色斑","毛孔","皱纹"],
}

app=Flask(__name__)

client=pymongo.MongoClient("127.0.0.1",27017)
db=client["health"]

@app.route('/register',methods=["POST"])
def register():
    #接收到第一次登录的信息，将其写如userInfo集合中
    data=json.loads(request.data)
    openId=data["openId"]
    #获取当前时间作为注册时间
    currentTime=str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
    doc={}
    doc["openId"]=openId
    doc["regTime"]=currentTime
    #TODO 写入预置的记录指标以及子指标
    db["indicatorInfo"].insert({"openId":openId,"indicators":innerIndicators})
    if db["userInfo"].insert(doc) is None:
        return "reg failed"
    else:
        return "reg success"



@app.route('/isFirstLogin',methods=['POST'])
def isFirstLogin():
    print("s:"+request.data+" ......")
    data=json.loads(request.data)
    openId=data["openId"]
    res=db["userInfo"].find({"openId":openId},{"regTime":True})
    count=0
    for item in res:
        count+=1
    print("count",count)
    if count<1:
        return "not signed"
    else:
        return "signed"

@app.route('/getIndicators',methods=['POST'])
def getIndicators():
    data=json.loads(request.data)
    openId=data["openId"]
    res=db["indicatorInfo"].find({"openId":openId},{"indicators":True})
    retValue={}
    for item in res:
        retValue=item["indicators"]
    print(retValue)
    return json.dumps(retValue)

@app.route('/getLatestData',methods=['POST'])
def getLatestData():
    latestData={}
    #获取健康指标项
    data=json.loads(request.data)
    openId=data["openId"]
    res=db["indicatorInfo"].find({"openId":openId},{"indicators":True})
    keyMap={}
    for item in res:
        keyMap=item["indicators"]

    #在数据库中查询各项的最近数据
    for main_key in keyMap:
        latestData[main_key]={}
        res=db[main_key].find({"openId":openId}).sort([("time",-1)]).limit(1)
        for record in res:
            del record["_id"]
            del record["openId"]
            latestData[main_key]=record
    return json.dumps(latestData)

#用户修改指标后更新数据库
@app.route('/updateFullItem',methods=['POST'])
def updateFullItem():
    data=json.loads(request.data)
    openId=data["openId"]
    updated_indicators=data["indicators"]
    db["indicatorInfo"].update({"openId":openId}, {"$set": { "indicators": updated_indicators }})
    return "update database"

@app.route('/editIndicator',methods=['POST'])
def editIndicator():
    data=json.loads(request.data)
    openId=data["openId"]
    updated_indicators=data["indicators"]
    db["indicatorInfo"].update({"openId":openId}, {"$set": { "indicators": updated_indicators }})
    return "update database"

@app.route('/addRecord',methods=['POST'])
def addRecord():
    data=json.loads(request.data)
    mainKey=data["mainKey"]
    record=data["record"]
    #加入添加时间
    currentTime=str(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
    record["time"]=currentTime
    db[mainKey].insert(record)
    return "add record"

@app.route('/getRecordUseMainKey',methods=['POST'])
def getRecordUseMainKey():
    data=json.loads(request.data)
    openId=data["openId"]
    mainKey=data["mainKey"]
    records=db[mainKey].find({"openId":openId}).sort([("time",-1)]).limit(10)
    retValue=[]
    tempDict={}
    for oneRecord in records:
        tempDict=oneRecord
        del tempDict["_id"]
        del tempDict["openId"]
        retValue.append(tempDict)
    print(retValue)
    return json.dumps(retValue)

@app.route('/delteOneRecord',methods=['POST'])
def delteOneRecord():
    data=json.loads(request.data)
    openId=data["openId"]
    mainKey=data["mainKey"]
    record=data["content"]
    record["openId"]=openId
    db[mainKey].delete_one(record)
    return "delete record"

@app.route('/requestDataDefault',methods=['POST'])
def requestDataDefault():
    data=json.loads(request.data)
    openId=data["openId"]
    count=data["count"]
    retValue={}

    #获取keyMap
    res=db["indicatorInfo"].find({"openId":openId},{"indicators":True})
    keyMap={}
    for item in res:
        keyMap=item["indicators"]
    for mainKey in keyMap:
        records=db[mainKey].find({"openId":openId}).sort([("time",-1)]).limit(count)
        #将records转为数组
        recordsArr=[]
        for oneRecord in records:
            recordsArr.append(oneRecord)
        recordsArr.reverse()
        if len(recordsArr)>0 and not (mainKey in retValue):
            retValue[mainKey]={}
        for oneRecord in recordsArr:
            for subKey in keyMap[mainKey]:
                if not subKey in retValue[mainKey]:
                    retValue[mainKey][subKey]=[]
                if subKey in oneRecord:
                    retValue[mainKey][subKey].append(oneRecord[subKey])
    print(retValue)
    return json.dumps(retValue)

@app.route('/requestDataByTime',methods=['POST'])
def requestDataByTime():
    data=json.loads(request.data)
    openId=data["openId"]
    startDate=data["startDate"]+" 00:00:00"
    endDate=data["endDate"]+" 23:59:59"
    #获取keyMap
    res=db["indicatorInfo"].find({"openId":openId},{"indicators":True})
    keyMap={}
    for item in res:
        keyMap=item["indicators"]
    
    retValue={}
    for mainKey in keyMap:
        records=db[mainKey].find({"openId":openId,"time":{'$gt':startDate},"time":{'$lt':endDate}}).sort([("time",1)])
        #将records转为数组
        recordsArr=[]
        for oneRecord in records:
            recordsArr.append(oneRecord)
        if len(recordsArr)>0 and not (mainKey in retValue):
            retValue[mainKey]={}
        for oneRecord in recordsArr:
            for subKey in keyMap[mainKey]:
                if not subKey in retValue[mainKey]:
                    retValue[mainKey][subKey]=[]
                if subKey in oneRecord:
                    retValue[mainKey][subKey].append(oneRecord[subKey])
    return json.dumps(retValue)


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)