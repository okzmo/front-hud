import { server } from '$lib/stores';
import { get } from 'svelte/store';
import tippy from 'tippy.js';
import MentionList from './MentionList.svelte';

export default {
	items: ({ query }) => {
		const serverMembers = get(server);
		const onlyDPName = serverMembers?.members.map((item) => item.username);
		console.log(serverMembers);

		return onlyDPName
			.filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
			.slice(0, 5);
	},
	render: () => {
		let component;
		let popup;

		return {
			onStart: (props) => {
				component = new MentionList({
					target: document.body,
					props: {
						items: props.items,
						command: props.command
					}
				});

				if (!props.clientRect) {
					return;
				}

				popup = tippy('body', {
					getReferenceClientRect: props.clientRect,
					appendTo: () => document.body,
					content: component.$$.fragment,
					showOnCreate: true,
					interactive: true,
					trigger: 'manual',
					placement: 'bottom-start'
				});
			},
			onUpdate(props) {
				component.$set({ items: props.items, command: props.command });

				if (!props.clientRect) {
					return;
				}

				popup[0].setProps({
					getReferenceClientRect: props.clientRect
				});
			},
			onKeyDown(props) {
				if (props.event.key === 'Escape') {
					popup[0].hide();
					return true;
				}
				return component.$$.ctx[component.$$.props.onKeyDown](props);
			},
			onExit() {
				popup[0].destroy();
				component.$destroy();
			}
		};
	}
};
