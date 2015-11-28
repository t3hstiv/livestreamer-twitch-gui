import { Application } from "Ember";
import {
	Adapter,
	LSAdapter,
	LSSerializer
} from "EmberData";
import {} from "initializers/initializers";
import { mainWindow } from "nwjs/nwjs";

// Routing
import Router from "router";

// Store
import TwitchAdapter from "store/TwitchAdapter";
import GithubAdapter from "store/GithubAdapter";

// Models: memory
import Livestreamer from "models/Livestreamer";

// Models: localstorage
import Window from "models/localstorage/Window";
import Settings from "models/localstorage/Settings";
import Versioncheck from "models/localstorage/Versioncheck";
import Auth from "models/localstorage/Auth";
import Search from "models/localstorage/Search";
import ChannelSettings from "models/localstorage/ChannelSettings";

// Models: github
import GithubReleases from "models/github/Releases";
import GithubReleasesSerializer from "models/github/ReleasesSerializer";

// Models: twitch
import TwitchToken from "models/twitch/Token";
import TwitchTokenSerializer from "models/twitch/TokenSerializer";

import TwitchGame from "models/twitch/Game";
import TwitchGameSerializer from "models/twitch/GameSerializer";
import TwitchStream from "models/twitch/Stream";
import TwitchStreamSerializer from "models/twitch/StreamSerializer";
import TwitchChannel from "models/twitch/Channel";
import TwitchChannelSerializer from "models/twitch/ChannelSerializer";
import TwitchImage from "models/twitch/Image";
import TwitchImageSerializer from "models/twitch/ImageSerializer";

import TwitchGamesTop from "models/twitch/GamesTop";
import TwitchGamesTopSerializer from "models/twitch/GamesTopSerializer";
import TwitchStreamsSummary from "models/twitch/StreamsSummary";
import TwitchStreamsSummarySerializer from "models/twitch/StreamsSummarySerializer";
import TwitchStreamsFeatured from "models/twitch/StreamsFeatured";
import TwitchStreamsFeaturedSerializer from "models/twitch/StreamsFeaturedSerializer";

import TwitchStreamsFollowed from "models/twitch/StreamsFollowed";
import TwitchStreamsFollowedSerializer from "models/twitch/StreamsFollowedSerializer";
import TwitchChannelsFollowed from "models/twitch/ChannelsFollowed";
import TwitchChannelsFollowedSerializer from "models/twitch/ChannelsFollowedSerializer";
import TwitchGamesFollowed from "models/twitch/GamesFollowed";
import TwitchGamesFollowedSerializer from "models/twitch/GamesFollowedSerializer";

import TwitchSearchGame from "models/twitch/SearchGame";
import TwitchSearchGameSerializer from "models/twitch/SearchGameSerializer";
import TwitchSearchStream from "models/twitch/SearchStream";
import TwitchSearchStreamSerializer from "models/twitch/SearchStreamSerializer";
import TwitchSearchChannel from "models/twitch/SearchChannel";
import TwitchSearchChannelSerializer from "models/twitch/SearchChannelSerializer";

import TwitchUserFollowsChannel from "models/twitch/UserFollowsChannel";
import TwitchUserFollowsChannelSerializer from "models/twitch/UserFollowsChannelSerializer";
import TwitchUserFollowsGame from "models/twitch/UserFollowsGame";
import TwitchUserFollowsGameSerializer from "models/twitch/UserFollowsGameSerializer";
import TwitchUserSubscription from "models/twitch/UserSubscription";
import TwitchUserSubscriptionSerializer from "models/twitch/UserSubscriptionSerializer";

import TwitchTicket from "models/twitch/Ticket";
import TwitchTicketSerializer from "models/twitch/TicketSerializer";
import TwitchProduct from "models/twitch/Product";
import TwitchProductSerializer from "models/twitch/ProductSerializer";
import TwitchProductEmoticon from "models/twitch/ProductEmoticon";
import TwitchProductEmoticonSerializer from "models/twitch/ProductEmoticonSerializer";

// Ember additions/changes/fixes
import BooleanTransform from "store/BooleanTransform";
import LinkComponent from "components/LinkComponent";

// Helpers
import IsEqualHelper from "helpers/IsEqualHelper";
import IsNullHelper from "helpers/IsNullHelper";
import IsGtHelper from "helpers/IsGtHelper";
import IsGteHelper from "helpers/IsGteHelper";
import BoolNotHelper from "helpers/BoolNotHelper";
import BoolAndHelper from "helpers/BoolAndHelper";
import BoolOrHelper from "helpers/BoolOrHelper";
import MathAddHelper from "helpers/MathAddHelper";
import MathSubHelper from "helpers/MathSubHelper";
import MathMulHelper from "helpers/MathMulHelper";
import MathDivHelper from "helpers/MathDivHelper";
import FormatViewersHelper from "helpers/FormatViewersHelper";
import FormatTimeHelper from "helpers/FormatTimeHelper";
import HoursFromNowHelper from "helpers/HoursFromNowHelper";
import TimeFromNowHelper from "helpers/TimeFromNowHelper";
import GetParamHelper from "helpers/GetParamHelper";

// Services
import MetadataService from "services/MetadataService";
import SettingsService from "services/SettingsService";
import AuthService from "services/AuthService";
import NotificationService from "services/NotificationService";
import ChatService from "services/ChatService";

// Application
import ApplicationRoute from "routes/ApplicationRoute";
import ApplicationController from "controllers/ApplicationController";
import ApplicationComponent from "components/ApplicationComponent";
import ApplicationTemplate from "hbs!templates/Application";

import LoadingRoute from "routes/LoadingRoute";
import LoadingTemplate from "hbs!templates/Loading";

import ErrorRoute from "routes/ErrorRoute";
import ErrorTemplate from "hbs!templates/Error";

import IndexRoute from "routes/IndexRoute";

import VersioncheckController from "controllers/VersioncheckController";
import LivestreamerController from "controllers/LivestreamerController";

// Modal Dialogs
import ModalDialogComponent from "components/ModalDialogComponent";
import ModalHeaderComponent from "components/ModalHeaderComponent";
import ModalBodyComponent from "components/ModalBodyComponent";
import ModalFooterComponent from "components/ModalFooterComponent";

import ModalFirstrunTemplate from "hbs!templates/modal/ModalFirstrun";
import ModalChangelogTemplate from "hbs!templates/modal/ModalChangelog";
import ModalNewreleaseTemplate from "hbs!templates/modal/ModalNewrelease";
import ModalSettingsTemplate from "hbs!templates/modal/ModalSettings";
import ModalLivestreamerTemplate from "hbs!templates/modal/ModalLivestreamer";
import ModalQuitTemplate from "hbs!templates/modal/ModalQuit";

// Components
import FormButtonComponent from "components/FormButtonComponent";
import SearchBarComponent from "components/SearchBarComponent";
import QuickBarComponent from "components/QuickBarComponent";
import QuickBarHomepageComponent from "components/QuickBarHomepageComponent";
import QuickBarRandomStreamComponent from "components/QuickBarRandomStreamComponent";
import ExternalLinkComponent from "components/ExternalLinkComponent";
import LivestreamerDocsComponent from "components/LivestreamerDocsComponent";
import CheckBoxComponent from "components/CheckBoxComponent";
import RadioButtonComponent from "components/RadioButtonComponent";
import RadioButtonsComponent from "components/RadioButtonsComponent";
import FileSelectComponent from "components/FileSelectComponent";
import GameItemComponent from "components/GameItemComponent";
import StreamItemComponent from "components/StreamItemComponent";
import ChannelItemComponent from "components/ChannelItemComponent";
import SubscriptionItemComponent from "components/SubscriptionItemComponent";
import InfiniteScrollComponent from "components/InfiniteScrollComponent";
import EmbeddedLinksComponent from "components/EmbeddedLinksComponent";
import FlagIconComponent from "components/FlagIconComponent";
import StatsRowComponent from "components/StatsRowComponent";
import LangFilterComponent from "components/LangFilterComponent";
import PreviewImageComponent from "components/PreviewImageComponent";
import OpenChatComponent from "components/OpenChatComponent";
import TwitchEmotesComponent from "components/TwitchEmotesComponent";
import ShareChannelComponent from "components/ShareChannelComponent";
import SubscribeChannelComponent from "components/SubscribeChannelComponent";
import FollowChannelComponent from "components/FollowChannelComponent";
import FollowGameComponent from "components/FollowGameComponent";
import WrapContentComponent from "components/WrapContentComponent";
import DropDownComponent from "components/DropDownComponent";
import ModalLogComponent from "components/ModalLogComponent";
import LoadingSpinnerComponent from "components/LoadingSpinnerComponent";
import HeadlineTotalsComponent from "components/HeadlineTotalsComponent";

// Content
import FeaturedRoute from "routes/FeaturedRoute";
import FeaturedController from "controllers/FeaturedController";
import FeaturedTemplate from "hbs!templates/Featured";

import WatchingRoute from "routes/WatchingRoute";
import WatchingController from "controllers/WatchingController";
import WatchingTemplate from "hbs!templates/Watching";

import SearchRoute from "routes/SearchRoute";
import SearchController from "controllers/SearchController";
import SearchTemplate from "hbs!templates/Search";

import GamesLoadingRoute from "routes/LoadingRoute";
import GamesLoadingTemplate from "hbs!templates/Loading";
import GamesIndexRoute from "routes/GamesIndexRoute";
import GamesIndexController from "controllers/GamesIndexController";
import GamesIndexTemplate from "hbs!templates/games/GamesIndex";
import GamesGameRoute from "routes/GamesGameRoute";
import GamesGameController from "controllers/GamesGameController";
import GamesGameTemplate from "hbs!templates/games/GamesGame";

import ChannelsRoute from "routes/ChannelsRoute";
import ChannelsController from "controllers/ChannelsController";
import ChannelsTemplate from "hbs!templates/Channels";

import ChannelRoute from "routes/ChannelRoute";
import ChannelController from "controllers/ChannelController";
import ChannelTemplate from "hbs!templates/channel/Channel";
import ChannelLoadingRoute from "routes/LoadingRoute";
import ChannelLoadingTemplate from "hbs!templates/Loading";
import ChannelIndexRoute from "routes/ChannelIndexRoute";
import ChannelIndexController from "controllers/ChannelIndexController";
import ChannelIndexTemplate from "hbs!templates/channel/ChannelIndex";
import ChannelSettingsRoute from "routes/ChannelSettingsRoute";
import ChannelSettingsController from "controllers/ChannelSettingsController";
import ChannelSettingsTemplate from "hbs!templates/channel/ChannelSettings";

import UserLoadingRoute from "routes/LoadingRoute";
import UserLoadingTemplate from "hbs!templates/Loading";
import UserIndexRoute from "routes/UserIndexRoute";
import UserIndexController from "controllers/UserIndexController";
import UserIndexTemplate from "hbs!templates/user/UserIndex";
import UserAuthRoute from "routes/UserAuthRoute";
import UserAuthController from "controllers/UserAuthController";
import UserAuthTemplate from "hbs!templates/user/UserAuth";
import UserSubscriptionsRoute from "routes/UserSubscriptionsRoute";
import UserSubscriptionsTemplate from "hbs!templates/user/UserSubscriptions";
import UserFollowedStreamsRoute from "routes/UserFollowedStreamsRoute";
import UserFollowedStreamsTemplate from "hbs!templates/user/UserFollowedStreams";
import UserFollowedChannelsRoute from "routes/UserFollowedChannelsRoute";
import UserFollowedChannelsController from "controllers/UserFollowedChannelsController";
import UserFollowedChannelsTemplate from "hbs!templates/user/UserFollowedChannels";
import UserFollowedGamesRoute from "routes/UserFollowedGamesRoute";
import UserFollowedGamesTemplate from "hbs!templates/user/UserFollowedGames";

import SettingsRoute from "routes/SettingsRoute";
import SettingsController from "controllers/SettingsController";
import SettingsTemplate from "hbs!templates/Settings";

import AboutController from "controllers/AboutController";
import AboutTemplate from "hbs!templates/About";


export default Application.create({
	// Configuration
	rootElement: document.documentElement,

	// Routing
	Router,

	// Store
	ApplicationAdapter: TwitchAdapter,

	// Models: memory
	Livestreamer,
	LivestreamerAdapter: Adapter,

	// Models: localstorage
	Window,
	WindowAdapter: LSAdapter.extend({ namespace: "window" }),
	WindowSerializer: LSSerializer,
	Settings,
	SettingsAdapter: LSAdapter.extend({ namespace: "settings" }),
	SettingsSerializer: LSSerializer,
	Versioncheck,
	VersioncheckAdapter: LSAdapter.extend({ namespace: "versioncheck" }),
	VersioncheckSerializer: LSSerializer,
	Auth,
	AuthAdapter: LSAdapter.extend({ namespace: "auth" }),
	AuthSerializer: LSSerializer,
	Search,
	SearchAdapter: LSAdapter.extend({ namespace: "search" }),
	SearchSerializer: LSSerializer,
	ChannelSettings,
	ChannelSettingsAdapter: LSAdapter.extend({ namespace: "channelsettings" }),
	ChannelSettingsSerializer: LSSerializer,

	// Models: github
	GithubReleases,
	GithubReleasesAdapter: GithubAdapter,
	GithubReleasesSerializer,

	// Models: twitch
	TwitchToken,
	TwitchTokenSerializer,

	TwitchGame,
	TwitchGameSerializer,
	TwitchStream,
	TwitchStreamSerializer,
	TwitchChannel,
	TwitchChannelSerializer,
	TwitchImage,
	TwitchImageSerializer,

	TwitchGamesTop,
	TwitchGamesTopSerializer,
	TwitchStreamsSummary,
	TwitchStreamsSummarySerializer,
	TwitchStreamsFeatured,
	TwitchStreamsFeaturedSerializer,

	TwitchStreamsFollowed,
	TwitchStreamsFollowedSerializer,
	TwitchChannelsFollowed,
	TwitchChannelsFollowedSerializer,
	TwitchGamesFollowed,
	TwitchGamesFollowedSerializer,

	TwitchSearchGame,
	TwitchSearchGameSerializer,
	TwitchSearchStream,
	TwitchSearchStreamSerializer,
	TwitchSearchChannel,
	TwitchSearchChannelSerializer,

	TwitchUserFollowsChannel,
	TwitchUserFollowsChannelSerializer,
	TwitchUserFollowsGame,
	TwitchUserFollowsGameSerializer,
	TwitchUserSubscription,
	TwitchUserSubscriptionSerializer,

	TwitchTicket,
	TwitchTicketSerializer,
	TwitchProduct,
	TwitchProductSerializer,
	TwitchProductEmoticon,
	TwitchProductEmoticonSerializer,

	// Ember additions/changes/fixes
	BooleanTransform,
	LinkComponent,

	// Helpers
	IsEqualHelper,
	IsNullHelper,
	IsGtHelper,
	IsGteHelper,
	BoolNotHelper,
	BoolAndHelper,
	BoolOrHelper,
	MathAddHelper,
	MathSubHelper,
	MathMulHelper,
	MathDivHelper,
	FormatViewersHelper,
	FormatTimeHelper,
	HoursFromNowHelper,
	TimeFromNowHelper,
	GetParamHelper,

	// Services
	MetadataService,
	SettingsService,
	AuthService,
	NotificationService,
	ChatService,

	// Application
	ApplicationRoute,
	ApplicationController,
	ApplicationView: ApplicationComponent,
	ApplicationTemplate,

	LoadingRoute,
	LoadingTemplate,

	ErrorRoute,
	ErrorTemplate,

	IndexRoute,

	VersioncheckController,
	LivestreamerController,

	// Modal Dialogs
	ModalDialogComponent,
	ModalHeaderComponent,
	ModalBodyComponent,
	ModalFooterComponent,

	ModalFirstrunTemplate,
	ModalChangelogTemplate,
	ModalNewreleaseTemplate,
	ModalSettingsTemplate,
	ModalLivestreamerTemplate,
	ModalQuitTemplate,

	// Components
	FormButtonComponent,
	SearchBarComponent,
	QuickBarComponent,
	QuickBarHomepageComponent,
	QuickBarRandomStreamComponent,
	ExternalLinkComponent,
	LivestreamerDocsComponent,
	CheckBoxComponent,
	RadioButtonComponent,
	RadioButtonsComponent,
	FileSelectComponent,
	GameItemComponent,
	StreamItemComponent,
	ChannelItemComponent,
	SubscriptionItemComponent,
	InfiniteScrollComponent,
	EmbeddedLinksComponent,
	FlagIconComponent,
	StatsRowComponent,
	LangFilterComponent,
	PreviewImageComponent,
	OpenChatComponent,
	TwitchEmotesComponent,
	ShareChannelComponent,
	SubscribeChannelComponent,
	FollowChannelComponent,
	FollowGameComponent,
	WrapContentComponent,
	DropDownComponent,
	ModalLogComponent,
	LoadingSpinnerComponent,
	HeadlineTotalsComponent,


	// Content
	FeaturedRoute,
	FeaturedController,
	FeaturedTemplate,

	WatchingRoute,
	WatchingController,
	WatchingTemplate,

	SearchRoute,
	SearchController,
	SearchTemplate,

	GamesLoadingRoute,
	GamesLoadingTemplate,
	GamesIndexRoute,
	GamesIndexController,
	GamesIndexTemplate,
	GamesGameRoute,
	GamesGameController,
	GamesGameTemplate,

	ChannelsRoute,
	ChannelsController,
	ChannelsTemplate,

	ChannelRoute,
	ChannelController,
	ChannelTemplate,
	ChannelLoadingRoute,
	ChannelLoadingTemplate,
	ChannelIndexRoute,
	ChannelIndexController,
	ChannelIndexTemplate,
	ChannelSettingsRoute,
	ChannelSettingsController,
	ChannelSettingsTemplate,

	UserLoadingRoute,
	UserLoadingTemplate,
	UserIndexRoute,
	UserIndexController,
	UserIndexTemplate,
	UserAuthRoute,
	UserAuthController,
	UserAuthTemplate,
	UserSubscriptionsRoute,
	UserSubscriptionsTemplate,
	UserFollowedStreamsRoute,
	UserFollowedStreamsTemplate,
	UserFollowedChannelsRoute,
	UserFollowedChannelsController,
	UserFollowedChannelsTemplate,
	UserFollowedGamesRoute,
	UserFollowedGamesTemplate,

	SettingsRoute,
	SettingsController,
	SettingsTemplate,

	AboutController,
	AboutTemplate,


	// ready event
	ready: function ready() {
		// wait for the SettingsService to load
		var settings = this.__container__.lookup( "service:settings" );
		settings.addObserver( "content", function() {
			if ( !settings.get( "content" ) ) { return; }
			mainWindow.emit( "ready", settings );
		});
	},

	toString: function() { return "App"; }
});
