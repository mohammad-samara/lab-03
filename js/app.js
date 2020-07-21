let allImage = [];
let keywords = [];
function findKeywords(item) {
    if (keywords.length == 0) { keywords.push(item.keyword); }
    var matched = false;
    for (let i = 0; i < keywords.length; i++) {
        if (item.keyword == keywords[i]) {
            matched = true;
        }
    } if (!matched) { keywords.push(item.keyword); }
}

function ImgData(item) {
    this.image_url = item.image_url;
    this.title = item.title;
    this.description = item.description;
    this.keyword = item.keyword;
    this.horns = item.horns;

}
ImgData.prototype.render = function () {
    let photoTemplate = $('#photo-template').clone();
    photoTemplate.removeAttr('id');
    photoTemplate.addClass(this.keyword);
    photoTemplate.html(`<h2>${this.title}</h2>
        <img src="${this.image_url}" alt="${this.keyword}">
        <p>${this.description}</p>`);
    $('main').append(photoTemplate);
}

$.get('data/page-1.json').then(data => {
    data.forEach(item => {
        let imgData = new ImgData(item);
        imgData.render();
        allImage.push(imgData);
        findKeywords(item);
    })
    console.log("lenght from inside : "+ keywords.length);
    for (let i = 0; i < keywords.length; i++) {                                  // add keywords as options in the selection form
    let keyOption = $(`<option value="${keywords[i]}">${keywords[i]}</option>`);
    $('#imgFilter').append(keyOption);
    }
    $('#photo-template').hide();
});
//////////////// selection and filter
console.log("lenght from outside : "+ keywords.length);
$('#imgFilter').on('change', function(event){
    var selected=this.options[this.selectedIndex].value;
    console.log(selected);
    $('.imgInfo').hide();
    $(`.${selected}`).show();
    if(this.selectedIndex==0){$('.imgInfo').show();$('#photo-template').hide();}

});