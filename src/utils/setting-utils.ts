<<<<<<< HEAD
=======
import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

>>>>>>> origin/main
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

<<<<<<< HEAD
export function applyThemeToDocument(theme: string) {
	switch (theme) {
		case "light":
			document.documentElement.classList.remove("dark");
			break;
		case "dark":
			document.documentElement.classList.add("dark");
			break;
		case "auto":
=======
export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
>>>>>>> origin/main
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
<<<<<<< HEAD
	document.documentElement.setAttribute("data-theme", "github-dark");
}

export function setTheme(theme: string): void {
=======
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
>>>>>>> origin/main
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

<<<<<<< HEAD
export function getStoredTheme(): string {
	return (localStorage.getItem("theme") as string) || "light";
=======
export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
>>>>>>> origin/main
}
