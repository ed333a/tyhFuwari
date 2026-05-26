import { parse } from "yaml";
import { z } from "zod";
import yamlRaw from "@/data/friend-links.yaml?raw";

const rawConfig = parse(yamlRaw);

const friendLinksCfgSchema = z.array(z.object({
    name: z.string(),
    desc: z.string(),
    tag: z.string().default(""),
    'link-list': z.array(z.object({
        name: z.string(),
        link: z.string(),
        cover: z.string(),
        descr: z.string(),
        icon: z.string().default(""),
        tag: z.string().default(""),
        'icon-color': z.string().default("linear-gradient(135deg, #ff6d6d, #6dffb6)"),
    })).default([]),
}));

type FriendLinks = z.infer<typeof friendLinksCfgSchema>;
export const friendLinks: FriendLinks = friendLinksCfgSchema.parse(rawConfig);
