export async function GET() {
    const isDev = import.meta.env.DEV;

    const fullFontType = "ttf";
    const subSetType = "woff2";

    // 字重配置（与脚本中的保持一致）
    const fontWeights = [
        { family: 'Yozai-Light', file: 'yozai/Yozai-Light', weight: 300 },
        { family: 'Yozai-Regular', file: 'yozai/Yozai-Regular', weight: 400 },
        { family: 'Yozai-Medium', file: 'yozai/Yozai-Medium', weight: 500 },
        { family: 'LXGWWenKaiMonoGB-Light', file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Light', weight: 300 },
        { family: 'LXGWWenKaiMonoGB-Regular', file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Regular', weight: 400 },
        { family: 'LXGWWenKaiMonoGB-Medium', file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Medium', weight: 500 },
        { family: 'JetBrainsMono-Light', file: 'jetbrains-mono/JetBrainsMono-Light', weight: 300 },
        { family: 'JetBrainsMono-Medium', file: 'jetbrains-mono/JetBrainsMono-Medium', weight: 500 },
        { family: 'JetBrainsMono-Regular', file: 'jetbrains-mono/JetBrainsMono-Regular', weight: 400 },
        { family: 'JetBrainsMono-Thin', file: 'jetbrains-mono/JetBrainsMono-Thin', weight: 200 },
    ];

    const fontFaces = fontWeights.map(({ family, file, weight }) => {
        const url = isDev
            ? `/fonts/${file}.${fullFontType}`
            : `__FONT_HASH_${family}__`;
        return `@font-face {
    font-family: '${family}';
    src: url('${url}') format('${subSetType}');
    font-weight: ${weight};
    font-style: normal;
    font-display: swap;
}`;
    }).join('\n');

    const css = `/* 自动生成的全局字体声明 */
${fontFaces}
/* (保留内容) 可以继续添加 css 样式 */

/* 应用全局字体 */
* {
    font-family: 'JetBrainsMono-Regular', 'LXGWWenKaiMonoGB-Light';
}
`;

    return new Response(css, {
        headers: { 'Content-Type': 'text/css' },
    });
}
