let allImage = [];
let allImage1=[];
let allImage2=[];
let nextPageImgCounter=0;
//let keywords = [];
let keywords1=[];
let keywords2=[];
let currentPage="page1";
function findKeywords(item ,keywordsNum) {
    if (keywordsNum.length == 0) { keywordsNum.push(item.keyword.toLowerCase()); }
    var matched = false;
    for (let i = 0; i < keywordsNum.length; i++) {
        if (item.keyword.toLowerCase() == keywordsNum[i]) {
            matched = true;
        }
    } if (!matched) { keywordsNum.push(item.keyword.toLowerCase()); }
}

function ImgData(item, pageNum) {
    this.image_url = item.image_url;
    this.title = item.title;
    this.description = item.description;
    this.keyword = item.keyword.toLowerCase();
    this.horns = item.horns;
    this.pageNum=pageNum;
    allImage.push(this);
    if(pageNum=="page1"){allImage1.push(this);}else{allImage2.push(this);}
}
ImgData.prototype.render = function (pageNum) {
    
    let mustacheTemplate=$('#imgCard').html();
    let newObject=Mustache.render(mustacheTemplate, this);
    //newObject.addClass(pageNum);
    $('main').append(newObject);
}

//page1 or default page
$.get('data/page-1.json').then(data => {
    data.forEach(item => {
        let imgData = new ImgData(item, "page1");
        //imgData.render();
        findKeywords(item ,keywords1);
    });
    for (let i=0; i<allImage.length;i++){
        allImage[i].render("page1");
        nextPageImgCounter++;
    }

    ///console.log("lenght from inside : " + keywords.length);
    for (let i = 0; i < keywords1.length; i++) {                                  // add keywords as options in the selection form
        let keyOption = $(`<option value="${keywords1[i]}">${keywords1[i]}</option>`);
        $('#imgFilter').append(keyOption);
    }
    $('#photo-template').hide();
});
//page2
$.get('data/page-2.json').then(data => {
    ///console.log("lenght from page2 : " + keywords.length);
    data.forEach(item => {
        let imgData = new ImgData(item, "page2");
        findKeywords(item ,keywords2);
    });
    for (let i=nextPageImgCounter; i<allImage.length;i++){
        allImage[i].render("page2");
        nextPageImgCounter++;
    }

    // for (let i = 0; i < keywords2.length; i++) {                                  // add keywords as options in the selection form
    //     let keyOption = $(`<option value="${keywords2[i]}">${keywords2[i]}</option>`);
    //     $('#imgFilter').append(keyOption);
    // }
    $('#photo-template').hide();
    $('.page2').hide();
});
//////page2 click
$('#page2').on('click', function (event){
    event.preventDefault();
    currentPage="page2";
    $('.page2').show();
    $('.page1').hide();
    $('#imgFilter').empty();
    $('#imgFilter').append('<option>Filter by Keyword</option>');
    for (let i = 0; i < keywords2.length; i++) {                                  // add keywords as options in the selection form
        let keyOption = $(`<option value="${keywords2[i]}">${keywords2[i]}</option>`);
        $('#imgFilter').append(keyOption);
    }
});
//////page1 click
$('#page1').on('click', function (event){
    event.preventDefault();
    currentPage="page1";
    $('.page1').show();
    $('.page2').hide();
    $('#imgFilter').empty();
    //let keyOption = $(`<option value="${keywords1[i]}">${keywords1[i]}</option>`);
    $('#imgFilter').append('<option>Filter by Keyword</option>');
    for (let i = 0; i < keywords1.length; i++) {                                  // add keywords as options in the selection form
        let keyOption = $(`<option value="${keywords1[i]}">${keywords1[i]}</option>`);
        $('#imgFilter').append(keyOption);
    }
});
//////////////// selection and filter
$('#imgFilter').on('change', function (event) {
    var selected = this.options[this.selectedIndex].value;
    console.log(selected);
    $('.imgInfo').hide();
    $(`.${selected}.${currentPage}`).show();
    if (this.selectedIndex == 0) { $(`.${currentPage}`).show();}

});