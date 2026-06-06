export async function GET() {
    const isDev = import.meta.env.DEV 

    const fullFontType = "ttf";
    const subSetType = "woff2";

    // 字重配置（与脚本中的保持一致） 
    const fontWeights = [
        // { family: 'Yozai'                   , file: 'yozai/Yozai-Light'                              , weight: 300, style: "normal", },
        { family: 'Yozai'                   , file: 'yozai/Yozai-Regular'                            , weight: 400, style: "normal", },
        // { family: 'Yozai'                   , file: 'yozai/Yozai-Medium'                             , weight: 500, style: "normal", },
        // { family: 'LXGWWenKaiMonoGB'        , file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Light'          , weight: 300, style: "normal", },
        { family: 'LXGWWenKaiMonoGB'        , file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Regular'        , weight: 400, style: "normal", },
        // { family: 'LXGWWenKaiMonoGB'        , file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Medium'         , weight: 500, style: "normal", },
        { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Regular'           , weight: 400, style: "normal", },
        // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-SemiBold'          , weight: 600, style: "normal", },
        // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-SemiBoldItalic'    , weight: 600, style: "italic", },
        // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Thin'              , weight: 100, style: "normal", },
        // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-ThinItalic'        , weight: 100, style: "italic", },
        // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Bold'              , weight: 700, style: "normal", },
        // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-BoldItalic'        , weight: 700, style: "italic", },
        // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-ExtraBold'         , weight: 800, style: "normal", },
        // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-ExtraBoldItalic'   , weight: 800, style: "italic", },
        // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-ExtraLight'        , weight: 200, style: "normal", },
        // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-ExtraLightItalic'  , weight: 200, style: "italic", },
        { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-Italic'            , weight: 400, style: "italic", },
        // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Light'             , weight: 300, style: "normal", },
        // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-LightItalic'       , weight: 300, style: "italic", },
        // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Medium'            , weight: 500, style: "normal", },
        // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-MediumItalic'      , weight: 500, style: "italic", },
        // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Bold'            , weight: 700, style: "normal", },
        // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-BoldItalic'      , weight: 700, style: "italic", },
        // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-ExtraBold'       , weight: 800, style: "normal", },
        // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-ExtraBoldItalic' , weight: 800, style: "italic", },
        // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-ExtraLight'      , weight: 200, style: "normal", },
        // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-ExtraLightItalic', weight: 200, style: "italic", },
        // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-Italic'          , weight: 400, style: "italic", },
        // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Light'           , weight: 300, style: "normal", },
        // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-LightItalic'     , weight: 300, style: "italic", },
        // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Medium'          , weight: 500, style: "normal", },
        // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-MediumItalic'    , weight: 500, style: "italic", },
        // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Regular'         , weight: 400, style: "normal", },
        // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-SemiBold'        , weight: 600, style: "normal", },
        // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-SemiBoldItalic'  , weight: 600, style: "italic", },
        // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Thin'            , weight: 100, style: "normal", },
        // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-ThinItalic'      , weight: 100, style: "italic", },
    ];

    const fontFaces = fontWeights.map(({ family, file, weight, style }) => {
        const url = isDev
            ? `/fonts/${file}.${fullFontType}`
            : `__FONT_HASH_${family}__`;
        return `@font-face {
    font-family: '${family}';
    src: url('${url}') format('${subSetType}');
    font-weight: ${weight};
    font-style: ${style};
    font-display: swap;
}`;
    }).join('\n');

    const css = `/* 自动生成的全局字体声明 */
${fontFaces}
/* (保留内容) 可以继续添加 css 样式 */

/* 应用全局字体 */
* {
    font-family: 'JetBrainsMono', 'JetBrainsMono-Italic', 'LXGWWenKaiMonoGB';
    line-height: 1.5rem
}
`;

    return new Response(css, {
        headers: { 'Content-Type': 'text/css' },
    });
}
