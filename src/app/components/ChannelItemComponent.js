import ListItemComponent from "components/ListItemComponent";
import layout from "hbs!templates/components/ChannelItemComponent";


export default ListItemComponent.extend({
	layout,
	classNames: [ "channel-item-component" ]
});
