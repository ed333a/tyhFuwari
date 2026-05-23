import { beautyConfig, devConfig } from "@/types/config";

const imageModules = import.meta.glob<string>(
	"../assets/**/*.{jpg,png,svg,webp,gif,bmp}",
	{ eager: true, query: "url", import: "default" },
) as Record<string, string>;

if (devConfig.debug) {
	console.log("Loaded image modules:", imageModules);
}

// 将配置中的 (相对) 路径映射到真实的图片 URL
function getImageUrl(relativePath: string): string {
	// 如果已经是绝对路径 (在 public 文件夹下, 以 / 开头), 直接返回
	if (relativePath.startsWith("/")) return relativePath;

	// 否则认为路径是相对于 src/assets 目录下的，构建完整 glob 匹配路径
	const fullPath = `../${relativePath}`;
	const url = imageModules[fullPath];
	if (!url) {
		console.warn(`图片未找到: ${fullPath}`);
		return "";
	}
	return url;
}

export const backgroundUrl = getImageUrl(beautyConfig.background.image.url);
