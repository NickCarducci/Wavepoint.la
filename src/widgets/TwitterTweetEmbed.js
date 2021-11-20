import React, { Component } from "react";
import PropTypes from "prop-types";
import ExecutionEnvironment from "exenv";

export default class TwitterTweetEmbed extends Component {
  static propTypes = {
    /**
     * Tweet id that needs to be shown
     */
    tweetId: PropTypes.string.isRequired,
    /**
     * Additional options to pass to twitter widget plugin
     */
    options: PropTypes.object,
    /**
     * Placeholder while tweet is loading
     */
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * Function to execute after load, return html element
     */
    onLoad: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.tw = React.createRef();
  }

  renderWidget() {
    const { onLoad } = this.props;
    if (!window.twttr) {
      console.error(
        "Failure to load window.twttr in TwitterTweetEmbed, aborting load."
      );
      return;
    }
    if (!this.isMountCanceled) {
      let options = Object.assign({}, this.props.options);
      var widget = null;
      var input = null;
      if (this.props.isHashtag) {
        widget = "createHashtagButton";
        input = this.props.tweetId;
      } else if (this.props.isProfile) {
        //console.log("twitter profile " + this.props.tweetId);
        options = Object.assign({}, options, {
          theme: this.props.theme,
          linkColor: this.props.linkColor,
          borderColor: this.props.borderColor,
          lang: this.props.lang
        });
        widget = "createFollowButton";
        input = this.props.tweetId;
        /*widget = "createTimeline";
        input = {
          sourceType: "profile",
          screenName: this.props.tweetId,
          userId: this.props.userId,
          ownerScreenName: this.props.ownerScreenName,
          slug: this.props.slug,
          id: this.props.id || this.props.widgetId,
          url: this.props.url
        };*/
      } else {
        widget = "createTweet";
        input = this.props.tweetId;
      }
      //this.refs.embedContainer
      window.twttr.widgets[widget](input, this.tw.current, options).then(
        (element) => {
          this.setState({
            isLoading: false
          });
          if (onLoad) {
            onLoad(element);
          }
        }
      );
    }
  }

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      let script = require("scriptjs");
      script("https://platform.twitter.com/widgets.js", "twitter-embed", () => {
        this.renderWidget();
      });
    }
  }

  componentWillUnmount() {
    this.isMountCanceled = true;
  }

  render() {
    return <div ref={this.tw} />;
  }
}
