import { commentCfg } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: string) {
	const artalkEle = document.getElementById("Comments");
	switch (theme) {
		case "light":
			// artalk 日间模式
			if (artalkEle) artalkEle.classList.remove("atk-dark-mode");
			document.documentElement.classList.remove("dark");
			break;
		case "dark":
			// artalk 夜间模式
			if (artalkEle) artalkEle.classList.add("atk-dark-mode");
			document.documentElement.classList.add("dark");
			break;
		case "auto":
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				if (artalkEle) artalkEle.classList.add("atk-dark-mode");
				document.documentElement.classList.add("dark");
			} else {
				if (artalkEle) artalkEle.classList.remove("atk-dark-mode");
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute("data-theme", "github-dark");
}

export function setTheme(theme: string): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): string {
	return (localStorage.getItem("theme") as string) || "light";
}
