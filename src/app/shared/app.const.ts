import { Color } from '@core/model/color.model';

export const DEBOUNCE_TIME_DEFAFULT = 300;

export const TITLE_ARTICLE_DEFAULT = 'Bài viết mới';
export const WORD_SEPARATOR = [' ', ',', '\n', /* '.' */];
export const WORD_SEPARATOR_REG = new RegExp('[' + WORD_SEPARATOR.join('') + ']+');
export const SENTENCE_WORD_SEPARATOR = ['.', ';', '?', '!', '\n']
// export const SENTENCE_WORD_SEPARATOR_REG = new RegExp('[' + SENTENCE_WORD_SEPARATOR.join('') + ']+');
// export const SENTENCE_WORD_SEPARATOR_REG = /(?:\.[^\d]|[^\d]\.)|[;?!\n]+/
export const SENTENCE_WORD_SEPARATOR_REG = /(?:\. )|[;?!\n]+/
// let colornamestable = document.getElementById('colornamestable')
// var children = colornamestable.children;
// children = Array.from(children)
// var o = children.map(child=>({name:child.querySelector('.colornamespan').textContent,value:child.querySelector('.colorhexspan').textContent}))
// o.forEach(x=>console.log(JSON.stringify(x)+','))
export const COLORS: Color[] = [
    { "name": "AliceBlue", "value": "#F0F8FF" },
    { "name": "AntiqueWhite", "value": "#FAEBD7" },
    { "name": "Aqua", "value": "#00FFFF" },
    { "name": "Aquamarine", "value": "#7FFFD4" },
    { "name": "Azure", "value": "#F0FFFF" },
    { "name": "Beige", "value": "#F5F5DC" },
    { "name": "Bisque", "value": "#FFE4C4" },
    { "name": "Black", "value": "#000000" },
    { "name": "BlanchedAlmond", "value": "#FFEBCD" },
    { "name": "Blue", "value": "#0000FF" },
    { "name": "BlueViolet", "value": "#8A2BE2" },
    { "name": "Brown", "value": "#A52A2A" },
    { "name": "BurlyWood", "value": "#DEB887" },
    { "name": "CadetBlue", "value": "#5F9EA0" },
    { "name": "Chartreuse", "value": "#7FFF00" },
    { "name": "Chocolate", "value": "#D2691E" },
    { "name": "Coral", "value": "#FF7F50" },
    { "name": "CornflowerBlue", "value": "#6495ED" },
    { "name": "Cornsilk", "value": "#FFF8DC" },
    { "name": "Crimson", "value": "#DC143C" },
    { "name": "Cyan", "value": "#00FFFF" },
    { "name": "DarkBlue", "value": "#00008B" },
    { "name": "DarkCyan", "value": "#008B8B" },
    { "name": "DarkGoldenRod", "value": "#B8860B" },
    { "name": "DarkGray", "value": "#A9A9A9" },
    { "name": "DarkGrey", "value": "#A9A9A9" },
    { "name": "DarkGreen", "value": "#006400" },
    { "name": "DarkKhaki", "value": "#BDB76B" },
    { "name": "DarkMagenta", "value": "#8B008B" },
    { "name": "DarkOliveGreen", "value": "#556B2F" },
    { "name": "DarkOrange", "value": "#FF8C00" },
    { "name": "DarkOrchid", "value": "#9932CC" },
    { "name": "DarkRed", "value": "#8B0000" },
    { "name": "DarkSalmon", "value": "#E9967A" },
    { "name": "DarkSeaGreen", "value": "#8FBC8F" },
    { "name": "DarkSlateBlue", "value": "#483D8B" },
    { "name": "DarkSlateGray", "value": "#2F4F4F" },
    { "name": "DarkSlateGrey", "value": "#2F4F4F" },
    { "name": "DarkTurquoise", "value": "#00CED1" },
    { "name": "DarkViolet", "value": "#9400D3" },
    { "name": "DeepPink", "value": "#FF1493" },
    { "name": "DeepSkyBlue", "value": "#00BFFF" },
    { "name": "DimGray", "value": "#696969" },
    { "name": "DimGrey", "value": "#696969" },
    { "name": "DodgerBlue", "value": "#1E90FF" },
    { "name": "FireBrick", "value": "#B22222" },
    { "name": "FloralWhite", "value": "#FFFAF0" },
    { "name": "ForestGreen", "value": "#228B22" },
    { "name": "Fuchsia", "value": "#FF00FF" },
    { "name": "Gainsboro", "value": "#DCDCDC" },
    { "name": "GhostWhite", "value": "#F8F8FF" },
    { "name": "Gold", "value": "#FFD700" },
    { "name": "GoldenRod", "value": "#DAA520" },
    { "name": "Gray", "value": "#808080" },
    { "name": "Grey", "value": "#808080" },
    { "name": "Green", "value": "#008000" },
    { "name": "GreenYellow", "value": "#ADFF2F" },
    { "name": "HoneyDew", "value": "#F0FFF0" },
    { "name": "HotPink", "value": "#FF69B4" },
    { "name": "IndianRed ", "value": "#CD5C5C" },
    { "name": "Indigo  ", "value": "#4B0082" },
    { "name": "Ivory", "value": "#FFFFF0" },
    { "name": "Khaki", "value": "#F0E68C" },
    { "name": "Lavender", "value": "#E6E6FA" },
    { "name": "LavenderBlush", "value": "#FFF0F5" },
    { "name": "LawnGreen", "value": "#7CFC00" },
    { "name": "LemonChiffon", "value": "#FFFACD" },
    { "name": "LightBlue", "value": "#ADD8E6" },
    { "name": "LightCoral", "value": "#F08080" },
    { "name": "LightCyan", "value": "#E0FFFF" },
    { "name": "LightGoldenRodYellow", "value": "#FAFAD2" },
    { "name": "LightGray", "value": "#D3D3D3" },
    { "name": "LightGrey", "value": "#D3D3D3" },
    { "name": "LightGreen", "value": "#90EE90" },
    { "name": "LightPink", "value": "#FFB6C1" },
    { "name": "LightSalmon", "value": "#FFA07A" },
    { "name": "LightSeaGreen", "value": "#20B2AA" },
    { "name": "LightSkyBlue", "value": "#87CEFA" },
    { "name": "LightSlateGray", "value": "#778899" },
    { "name": "LightSlateGrey", "value": "#778899" },
    { "name": "LightSteelBlue", "value": "#B0C4DE" },
    { "name": "LightYellow", "value": "#FFFFE0" },
    { "name": "Lime", "value": "#00FF00" },
    { "name": "LimeGreen", "value": "#32CD32" },
    { "name": "Linen", "value": "#FAF0E6" },
    { "name": "Magenta", "value": "#FF00FF" },
    { "name": "Maroon", "value": "#800000" },
    { "name": "MediumAquaMarine", "value": "#66CDAA" },
    { "name": "MediumBlue", "value": "#0000CD" },
    { "name": "MediumOrchid", "value": "#BA55D3" },
    { "name": "MediumPurple", "value": "#9370DB" },
    { "name": "MediumSeaGreen", "value": "#3CB371" },
    { "name": "MediumSlateBlue", "value": "#7B68EE" },
    { "name": "MediumSpringGreen", "value": "#00FA9A" },
    { "name": "MediumTurquoise", "value": "#48D1CC" },
    { "name": "MediumVioletRed", "value": "#C71585" },
    { "name": "MidnightBlue", "value": "#191970" },
    { "name": "MintCream", "value": "#F5FFFA" },
    { "name": "MistyRose", "value": "#FFE4E1" },
    { "name": "Moccasin", "value": "#FFE4B5" },
    { "name": "NavajoWhite", "value": "#FFDEAD" },
    { "name": "Navy", "value": "#000080" },
    { "name": "OldLace", "value": "#FDF5E6" },
    { "name": "Olive", "value": "#808000" },
    { "name": "OliveDrab", "value": "#6B8E23" },
    { "name": "Orange", "value": "#FFA500" },
    { "name": "OrangeRed", "value": "#FF4500" },
    { "name": "Orchid", "value": "#DA70D6" },
    { "name": "PaleGoldenRod", "value": "#EEE8AA" },
    { "name": "PaleGreen", "value": "#98FB98" },
    { "name": "PaleTurquoise", "value": "#AFEEEE" },
    { "name": "PaleVioletRed", "value": "#DB7093" },
    { "name": "PapayaWhip", "value": "#FFEFD5" },
    { "name": "PeachPuff", "value": "#FFDAB9" },
    { "name": "Peru", "value": "#CD853F" },
    { "name": "Pink", "value": "#FFC0CB" },
    { "name": "Plum", "value": "#DDA0DD" },
    { "name": "PowderBlue", "value": "#B0E0E6" },
    { "name": "Purple", "value": "#800080" },
    { "name": "RebeccaPurple", "value": "#663399" },
    { "name": "Red", "value": "#FF0000" },
    { "name": "RosyBrown", "value": "#BC8F8F" },
    { "name": "RoyalBlue", "value": "#4169E1" },
    { "name": "SaddleBrown", "value": "#8B4513" },
    { "name": "Salmon", "value": "#FA8072" },
    { "name": "SandyBrown", "value": "#F4A460" },
    { "name": "SeaGreen", "value": "#2E8B57" },
    { "name": "SeaShell", "value": "#FFF5EE" },
    { "name": "Sienna", "value": "#A0522D" },
    { "name": "Silver", "value": "#C0C0C0" },
    { "name": "SkyBlue", "value": "#87CEEB" },
    { "name": "SlateBlue", "value": "#6A5ACD" },
    { "name": "SlateGray", "value": "#708090" },
    { "name": "SlateGrey", "value": "#708090" },
    { "name": "Snow", "value": "#FFFAFA" },
    { "name": "SpringGreen", "value": "#00FF7F" },
    { "name": "SteelBlue", "value": "#4682B4" },
    { "name": "Tan", "value": "#D2B48C" },
    { "name": "Teal", "value": "#008080" },
    { "name": "Thistle", "value": "#D8BFD8" },
    { "name": "Tomato", "value": "#FF6347" },
    { "name": "Turquoise", "value": "#40E0D0" },
    { "name": "Violet", "value": "#EE82EE" },
    { "name": "Wheat", "value": "#F5DEB3" },
    { "name": "White", "value": "#FFFFFF" },
    { "name": "WhiteSmoke", "value": "#F5F5F5" },
    { "name": "Yellow", "value": "#FFFF00" },
    { "name": "YellowGreen", "value": "#9ACD32" },
];

export const DARK_COLORS = [];
export const MEDIUM_COLORS = [];
export const LIGHT_COLORS = [];
export const NORMAL_COLORS = [];

for (let i = 0; i < COLORS.length; ++i) {
    const color = COLORS[i];
    if (color.name.startsWith("Dark")) {
        DARK_COLORS.push(color);
    } else if (color.name.startsWith("Medium")) {
        MEDIUM_COLORS.push(color);
    } else if (color.name.startsWith('Light')) {
        LIGHT_COLORS.push(color);
    } else {
        NORMAL_COLORS.push(color)
    }
}

export const MEDIUM_SENTENCE_COLOR_DEFAULT: Color = { "name": "MediumPurple", "value": "#9370DB" };
export const LONG_SENTENCE_COLOR_DEFAULT: Color = { "name": "DarkOrange", "value": "#FF8C00" };
export const RANGE_SENTENCE_DEFAULT = [20, 25];
export const LONG_PARAGRAPH_DEFAULT = 150;