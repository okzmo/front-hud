import { Node, mergeAttributes } from '@tiptap/core';

export const Emoji = Node.create({
	name: 'emoji',

	addAttributes() {
		return {
			src: {
				default: null
			},
			alt: {
				default: null
			}
		};
	},

	group: 'inline',
	inline: true,

	parseHTML() {
		return [
			{
				tag: 'img[class=emoji]'
			}
		];
	},

	renderHTML({ node, HTMLAttributes }) {
		return [
			'img',
			mergeAttributes(HTMLAttributes, {
				class: 'emoji-editor',
				src: node.attrs.src,
				alt: node.attrs.alt,
				title: node.attrs.alt
			})
		];
	}
});
