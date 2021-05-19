
//解析基础数据返回树结构数据
export function getTree(data,rootPid,id,pid){
    let treeData = [];
    data.forEach((item) => {
        if(item[pid] === rootPid){
            let myNode=getMyNode(item);
            getSubNode(id,pid,myNode,data);
            treeData.push(myNode);
        }
    });
    return treeData;
}

//解析基础数据返回树结构数据
function getSubNode(id,pid,myNode,data) {
    data.forEach((item) => {
        if(item[pid]===myNode[id]){
            let mySubNode=getMyNode(item);
            myNode.children.push(mySubNode)
        }
    });
    if(myNode.children.length!==0){
        myNode.children.forEach((subItem) => {
            getSubNode(id,pid,subItem,data);
        });
    }
}

function getMyNode(item) {
    item["children"]=[];
    return item;
}


