import Mention from '@tiptap/extension-mention';

export const EmojiSuggestion = Mention.extend({
	name: 'emojiSuggestion',

	addOptions() {
		return {
			...this.parent?.(),
			suggestion: {
				char: ':', // Trigger character for emoji suggestions
				command: ({ editor, range, props }) => {
					// Insert the selected emoji

					editor
						.chain()
						.focus()
						.deleteRange(range)
						.insertContent({
							type: 'emoji',
							attrs: {
								src: props.src,
								alt: props.alt
							}
						})
						.run();
				},
				allow: ({ editor, range }) => {
					return editor.can().insertContentAt(range, { type: 'emoji' });
				}
			}
		};
	}
});
