import { createStyle } from "@in/style";

/*###################################(STYLE)###################################*/
export const ImageStyle = createStyle({
	base: [
		"inline-block relative overflow-hidden",
		{ web: { display: "inline-block", position: "relative", overflow: "hidden" } },
	],
	settings: {
		fit: {
			contain: ["object-contain"],
			cover: ["object-cover"],
			fill: ["object-fill"],
			none: ["object-none"],
		},
		radius: {
			none: ["rounded-none", { web: { borderRadius: "0px" } }],
			sm: ["rounded-sm", { web: { borderRadius: "0.125rem" } }],
			md: ["rounded-md", { web: { borderRadius: "0.375rem" } }],
			lg: ["rounded-lg", { web: { borderRadius: "0.5rem" } }],
			full: ["rounded-full", { web: { borderRadius: "9999px" } }],
		},
		aspect: {
			auto: [""],
			"1/1": ["aspect-square", { web: { aspectRatio: "1 / 1" } }],
			"3/2": ["", { web: { aspectRatio: "3 / 2" } }],
			"16/9": ["", { web: { aspectRatio: "16 / 9" } }],
		},
		shadow: {
			none: ["shadow-none"],
			sm: ["shadow-sm"],
			md: ["shadow-md"],
			lg: ["shadow-lg"],
		},
		inline: {
			true: ["inline-block"],
			false: ["block"],
		},
	},
	defaultSettings: {
		fit: "cover",
		radius: "none",
		aspect: "auto",
		shadow: "none",
		inline: true,
	},
});
