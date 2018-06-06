let jsTree = new JsTree($('#container'));
let data = [
    {
        "id": 9,
        "parentId": 0,
        "text": "我是顶级3"
    },
    {
        "id": 1,
        "parentId": 0,
        "text": "我是顶级",
        "child": [
            {
                "id": 2,
                "parentId": 1,
                "text": "我是一级",
                "child": [
                    {
                        "id": 3,
                        "parentId": 2,
                        "text": "我是二级",
                        "child": [
                            {
                                "id": 5,
                                "parentId": 3,
                                "text": "我是二一级"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": 6,
        "parentId": 0,
        "text": "我是顶级2",
        "child": [
            {
                "id": 4,
                "parentId": 6,
                "text": "我是一一级"
            }
        ]
    }
]
jsTree.init({ data: data,isOpenAll:true, searchInput:$('#txt_seach'), childrenField: "child", value: "id", text: "text" ,clickCallback:(e)=>{
    console.log(e)
}});
$('#openAll').click(function(){
    jsTree.openAll();
})
$('#closeAll').click(function(){
    jsTree.closeAll();
})