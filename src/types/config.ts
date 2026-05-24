import { parse } from "yaml";
import { z } from "zod";
import yamlRaw from "../config.yaml?raw";

const rawConfig = parse(yamlRaw);

const themeColorSchema = z.object({
    "color-primary": z.string().default("#2ACAA0"),
    "card-bg": z.string().default("#ffffff"),
});

const sitepageSchema = z.object({
    enable: z.boolean().default(true),
    link: z.string().default(""),
});

const siteConfigSchema = z.object({
    author: z.string().default("Your Name"),
    avatar: z.string().default("assets/images/demo-avatar.png"),
    title: z.string().default("Astro little-sweet"),
    subtitle: z.string().default("A static blog template built with Astro"),
    description: z.string().default("A static blog template built with Astro, and with human-friendly configuration.",),
    locale: z.string().default("zh_CN"),
    siteUrl: z.string().default("https://example.com"),
    "page-width": z.string().default("75rem"),
    license: z.object({
        enable: z.boolean().default(true),
        name: z.string().default("CC-BY-NC-SA 4.0"),
        url: z
            .string()
            .default("https://creativecommons.org/licenses/by-nc-sa/4.0/"),
    }),
    favicons: z.array(
        z.object({
            src: z.string(),
            theme: z.string(),
            sizes: z.string(),
        }),
    ),
    keywords: z.array(z.string()).default([]),
    toc: z.object({
        enable: z.boolean().default(false),
        depth: z.int().default(2),
    }),
    postPermalink: z.string().default("/posts/:id_dec"),
    pages: z.object({
        categories: sitepageSchema,
        tags: sitepageSchema,
        about: sitepageSchema,
        friends: sitepageSchema,
        timeline: sitepageSchema,
        archive: sitepageSchema,
        rss: sitepageSchema,
        atom: sitepageSchema,
    }).default({
        categories: {enable: true, link: "/categories",},
        tags: {enable: true, link: "/tags",},
        about: {enable: true, link: "/about",},
        friends: {enable: true, link: "/friends",},
        timeline: {enable: true, link: "/timeline",},
        archive: {enable: true, link: "/archive",},
        rss: {enable: true, link: "/rss",},
        atom: {enable: true, link: "/atom",},
    })
});

const beautyConfigSchema = z.object({
    theme: z.enum(["light", "dark", "auto"]).default("light"),
    hue: z.int().default(250),
    "hue-fixed": z.boolean().default(true),
    "border-radius": z.string().default("25px"),
    bgColorAlpha: z.number().default(0.8),
    blur: z.object({
        enable: z.boolean().default(true),
        intensity: z.int().default(2),
    }).default({
        enable: true,
        intensity: 2,
    }),
    themeColors: z.object({
        light: themeColorSchema,
        dark: themeColorSchema.optional(),
    }),
    background: z.object({
        blur: z.int().default(1),
        image: z.object({
            enable: z.boolean().default(true),
            url: z.string().default("assets/canvas/blog_bg/bg8.svg"),
            svgColor: z.string().default(""),
        }),
        color: z.object({
            enable: z.boolean().default(true),
            linear: z.boolean().default(true),
            deg: z.int().default(135),
            colors: z.array(z.string()).default(["#CCFF00", "#FFCC00", "#FF5577"]),
            'colors-dark': z.array(z.string()).default(["#145545", "#3e235b", "#1e0a0e"]),
        }).default({
            enable: true,
            deg: 135,
            linear: true,
            colors: ["#CCFF00", "#FFCC00", "#FF5577"],
            'colors-dark': ["#145545", "#3e235b", "#1e0a0e"],
        }),
    }),
});

const navConfigSchema = z.object({
    title: z.string().default("Little Sweet"),
    title_icon: z.string().default("fa6-solid:bookmark"),
    items: z
        .array(
            z.object({
                link: z.string(),
                text: z.string(),
                icon: z.string().default(""),
                openInExternal: z.boolean().default(false),
            }),
        )
        .default([
            {
                link: "/",
                text: "Home",
                icon: "fa6-solid:house",
                openInExternal: false,
            },
            {
                link: "/about",
                text: "About",
                icon: "fa6-solid:user",
                openInExternal: false,
            },
        ]),
});

const bannerConfigSchema = z.object({
    enable: z.boolean().default(false),
    src: z.string().default("assets/images/demo-banner.png"),
    position: z.enum(["top", "bottom", "center"]).default("center"),
    credit: z.object({
        enable: z.boolean().default(false),
        text: z.string().default(""),
        url: z.string().default(""),
    }),
    "banner-height": z.string().default("35vh"),
    "banner-height-extend": z.string().default("30vh"),
    "banner-overlap": z.string().default("3.5rem"),
});

const devConfigSchema = z.object({
    debug: z.boolean().default(false),
});

const socialLinksSchema = z
    .array(
        z.object({
            name: z.string(),
            icon: z.string(),
            url: z.string(),
        }),
    )
    .default([
        {
            name: "twitter",
            icon: "fa6-fabrands:twitter",
            url: "https://twitter.com",
        },
        {
            name: "steam",
            icon: "fa6-fabrands:steam",
            url: "https://store.steampowered.com",
        },
        {
            name: "Github",
            icon: "fa6-fabrands:github",
            url: "https://github.com",
        },
    ]);

const configSchema = z.object({
    siteConfig: siteConfigSchema,
    dev: devConfigSchema,
    beauty: beautyConfigSchema,
    nav: navConfigSchema,
    banner: bannerConfigSchema,
    "social-links": socialLinksSchema,
});

type Config = z.infer<typeof configSchema>;
type SiteConfig = z.infer<typeof siteConfigSchema>;
type DevConfig = z.infer<typeof devConfigSchema>;
type BeautyConfig = z.infer<typeof beautyConfigSchema>;
type NavConfig = z.infer<typeof navConfigSchema>;
type BannerConfig = z.infer<typeof bannerConfigSchema>;
type SocialLinks = z.infer<typeof socialLinksSchema>;

export const config: Config = configSchema.parse(rawConfig);
export const devConfig: DevConfig = config.dev;
export const siteConfig: SiteConfig = config.siteConfig;
export const beautyConfig: BeautyConfig = config.beauty;
export const navConfig: NavConfig = config.nav;
export const bannerConfig: BannerConfig = config.banner;
export const socialLinksConfig: SocialLinks = config["social-links"];
