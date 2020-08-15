import Quill from 'quill';

// specify the fonts you would 
const fonts = ['Arial', 'Courier', 'Garamond', 'Tahoma', 'Times New Roman', 'Verdana'];
// generate code friendly names
function getFontName(font) {
  return font.toLowerCase().replace(/\s/g, "-");
}
const fontNames = fonts.map(font => getFontName(font));
// add fonts to style
let fontStyles = "";
fonts.forEach(function (font) {
  var fontName = getFontName(font);
  fontStyles += ".ql-snow .ql-picker.ql-font .ql-picker-label[data-value=" + fontName + "]::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=" + fontName + "]::before {" +
    "content: '" + font + "';" +
    "font-family: '" + font + "', sans-serif;" +
    "}" +
    ".ql-font-" + fontName + "{" +
    " font-family: '" + font + "', sans-serif;" +
    "}";
});
const node = document.createElement('style');
node.innerHTML = fontStyles;
document.body.appendChild(node);
const Font = Quill.import('formats/font');
Font.whitelist = fontNames;
Quill.register(Font, true);


export const quillConfig = {
  modules: {
    syntax: false,
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': Font.whitelist }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']                         // link and image, video
    ]
  }
};