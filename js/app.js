let allImage = [];
let allImage1 = [];
let allImage2 = [];
let Rendered = [];
let currentFilter="";
let nextPageImgCounter = 0;
//let keywords = [];
let keywords1 = [];
let keywords2 = [];
let currentPage = "page1";
function findKeywords(item, keywordsNum) {
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
    this.pageNum = pageNum;
    allImage.push(this);
    if (pageNum == "page1") { allImage1.push(this); } else { allImage2.push(this); }
}
ImgData.prototype.render = function (pageNum) {

    let mustacheTemplate = $('#imgCard').html();
    let newObject = Mustache.render(mustacheTemplate, this);
    //newObject.addClass(pageNum);
    $('#rendering').append(newObject);
}

//page1 or default page
$.get('data/page-1.json').then(data => {
    data.forEach(item => {
        let imgData = new ImgData(item, "page1");
        //imgData.render();
        findKeywords(item, keywords1);
    });
    allImage1.sort(sortByTitle);
    for (let i = 0; i < allImage1.length; i++) {
        allImage1[i].render("page1");
        nextPageImgCounter++;
    }
    Rendered = allImage1;

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
        findKeywords(item, keywords2);
    });
    allImage2.sort(sortByTitle);

    // for (let i = 0; i < keywords2.length; i++) {                                  // add keywords as options in the selection form
    //     let keyOption = $(`<option value="${keywords2[i]}">${keywords2[i]}</option>`);
    //     $('#imgFilter').append(keyOption);
    // }
    $('#photo-template').hide();
    $('.page2').hide();
});
//////page2 click
$('#page2').on('click', function (event) {
    event.preventDefault();
    currentPage = "page2";
    $('#rendering').empty();
    for (let i = 0; i < allImage2.length; i++) {
        allImage2[i].render("page2");
        nextPageImgCounter++;
    }
    Rendered = allImage2;
    $('#imgFilter').empty();
    $('#imgFilter').append('<option>Filter by Keyword</option>');
    for (let i = 0; i < keywords2.length; i++) {                                  // add keywords as options in the selection form
        let keyOption = $(`<option value="${keywords2[i]}">${keywords2[i]}</option>`);
        $('#imgFilter').append(keyOption);
    }
});
//////page1 click
$('#page1').on('click', function (event) {
    Rendered = allImage1;
    event.preventDefault();
    currentPage = "page1";
    $('#rendering').empty();
    for (let i = 0; i < allImage1.length; i++) {
        allImage1[i].render("page1");
        nextPageImgCounter++;
    }
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
    currentFilter=selected;
    $('.imgInfo').hide();
    $(`.${selected}.${currentPage}`).show();
    if (this.selectedIndex == 0) { $(`.${currentPage}`).show(); }

});

////////sort
$('#selectSort').on('change', function (event) {
    //var selected = this.options[this.selectedIndex].value;
    var selected = this.value;
    if (selected == "titleSort") {
        Rendered.sort(sortByTitle);

        $('#rendering').empty();
        for (let i = 0; i < Rendered.length; i++) {
            Rendered[i].render(`${currentPage}`);
        }

        $('.imgInfo').hide();
        console.log(currentFilter);
        if(currentFilter==""){$(`.${currentPage}`).show();}else{
            $(`.${currentFilter}.${currentPage}`).show();}
    }
    if (selected == "hornsSort") {
        Rendered.sort(sortByHorns);

        $('#rendering').empty();
        for (let i = 0; i < Rendered.length; i++) {
            Rendered[i].render(`${currentPage}`);
        }
        $('.imgInfo').hide();
        if(currentFilter==""){$(`.${currentPage}`).show();}else{
        $(`.${currentFilter}.${currentPage}`).show();}
    }
    // $('.imgInfo').hide();
    // $(`.${selected}.${currentPage}`).show();
    // if (this.selectedIndex == 0) { $(`.${currentPage}`).show();}

});

function sortByTitle(obj1, obj2) {
    return obj1.title.localeCompare(obj2.title);

}

function sortByHorns(obj1, obj2) {
    return obj1.horns - obj2.horns;
}