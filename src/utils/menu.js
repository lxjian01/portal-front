
//解析基础数据返回树结构数据
export function getTree(data,rootPid,id,pid){
    let treeData = [];
    data.forEach((item) => {
        if(item.pid === rootPid){
            getSubNode(id,pid,item,data);
            treeData.push(item);
        }
    });
    return treeData;
}

//解析基础数据返回树结构数据
function getSubNode(id,pid,myNode,data) {
    data.forEach((item) => {
        if(item.pid === myNode.id){
            if(!myNode.children){
                myNode.children = []
            }
            myNode.children.push(item)
        }
    });
    if(myNode.children){
        myNode.children.forEach((subItem) => {
            getSubNode(id,pid,subItem,data);
        });
    }
}


