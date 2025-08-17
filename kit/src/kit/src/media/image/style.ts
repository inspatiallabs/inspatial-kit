import { createStyle, type StyleProps } from "@in/style";

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

/*###################################(TYPES)###################################*/
export type ImageProps = StyleProps<typeof ImageStyle> &
	JSX.SharedProps & {
		src: string;
		alt?: string;
		width?: number;
		height?: number;
		sizes?: string;
		priority?: boolean;
		loading?: "lazy" | "eager";
		decoding?: "async" | "auto";
		fetchPriority?: "high" | "low" | "auto";
		crossOrigin?: "anonymous" | "use-credentials";
		referrerPolicy?: string;
		dpr?: number[];
		generateSrcSet?: (src: string, dprs: number[]) => string;
		placeholder?: "blur" | "color" | "none";
		blurDataURL?: string;
		placeholderColor?: string;
	};


