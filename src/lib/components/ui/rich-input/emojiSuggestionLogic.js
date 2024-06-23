import emojiData from '/src/assets/emojis/emoji_mapping.json';

export const loadEmojis = async (query = '') => {
	const lowercaseQuery = query.toLowerCase();
	const filteredEmojis = [];

	for (const [variation, keywords] of Object.entries(emojiData)) {
		for (const [keyword, emojiList] of Object.entries(keywords)) {
			if (keyword.includes(lowercaseQuery)) {
				for (const emoji of emojiList) {
					filteredEmojis.push(
						...emoji.svgFileNames.map((svgFileName) => ({
							shortcode: keyword,
							name: emoji.name,
							src: `/src/assets/emojis/${svgFileName}`,
							alt: emoji.name,
							variation: variation
						}))
					);

					if (filteredEmojis.length >= 25) {
						return filteredEmojis;
					}
				}
			}
		}
	}

	return filteredEmojis;
};
