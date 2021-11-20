import React from "react";

class Types extends React.Component {
  state = {
    placeholderEntry: ""
  };
  makeTypeRecipients = (rec) => {
    var re = this.props.recipients;
    if (re.includes(rec)) {
      const recipients = re.filter((item) => item !== rec);
      this.props.setRecipients({
        entityId: null,
        entityType: "users",
        recipients
      });
    } else {
      //console.log(this.state.etype);
      if (re.length < 3) {
        this.props.setRecipients({
          placeholderEntry: "",
          entityId: null,
          entityType: "users",
          recipients: [rec, ...this.props.recipients]
        });
      }
    }
  };
  makeTypeClearRecipients = (rec) => {
    var re = this.props.recipients;
    if (re.includes(rec)) {
      const recipients = re.filter((item) => item !== rec);
      this.props.setRecipients({ recipients });
    } else {
      //console.log(types);
      if (re.length < 3) {
        this.props.setRecipients({ recipients: [rec] });
      }
    }
  };
  render() {
    const {
      planInitial,
      recipientSuggestionsProfiled,
      pauseNeedTopic,
      topicSuggestions,
      auth,
      users,
      options,
      selectedType
    } = this.props;
    return (
      <div className="eventnewcitysearch">
        {planInitial &&
          recipientSuggestionsProfiled &&
          recipientSuggestionsProfiled.length > 0 && (
            <div>
              {pauseNeedTopic && <div>Please choose a topic</div>}
              <input
                placeholder="Topic"
                value={this.props.ttype}
                onChange={(e) => {
                  var ttype = e.target.value;
                  this.props.setType({
                    ttype
                  });
                }}
              />

              {topicSuggestions &&
                (topicSuggestions.length > 0 ? topicSuggestions : []).map(
                  (topic) => {
                    return (
                      <div
                        className={
                          this.props.ttype === topic
                            ? "eventtypeselected"
                            : "eventtypepotential"
                        }
                        id={topic}
                        onClick={() => {
                          this.handleTopic(topic);
                        }}
                      >
                        {topic}
                      </div>
                    );
                  }
                )}
            </div>
          )}
        {planInitial && (
          <input
            placeholder="New recipient"
            value={this.state.placeholderEntry}
            onChange={(e) => {
              var v = e.target.value;
              var w = users.find((x) => x.username === v);
              this.setState({
                placeholderEntry: v
              });
              w !== undefined &&
                this.props.setRecipients({
                  recipientSuggestionsProfiled: [
                    w,
                    ...recipientSuggestionsProfiled
                  ]
                });
            }}
          />
        )}
        {(this.state.placeholderEntry === ""
          ? recipientSuggestionsProfiled && recipientSuggestionsProfiled
          : users
        ).map((rec) => {
          if (rec && rec.id !== auth.uid) {
            return (
              <div
                key={rec.id}
                className={
                  this.props.recipients.includes(rec.id)
                    ? "eventtypeselected"
                    : "eventtypepotential"
                }
                id={rec}
                onClick={(e) => this.makeTypeRecipients(rec.id)}
              >
                {rec.username}
              </div>
            );
          } else return null;
        })}
        {options &&
          options.map((type, i) => {
            return (
              <div
                className={
                  selectedType ? "eventtypeselected" : "eventtypepotential"
                }
                key={i}
                onClick={() => {
                  this.handleTopic(type);
                }}
              >
                {type}
              </div>
            );
          })}
      </div>
    );
  }
}
export default Types;
