import React from "react";
import firebase from "../../.././init-firebase";

class ImageSetting extends React.Component {
  state = {};
  revert = (x) => {
    x.ref
      .updateMetadata({
        customMetadata: {
          public: false
        },
        metadata: {
          description: "no description",
          modified: new Date()
        }
      })
      .then(() => this.props.unloadGreenBlue())
      .catch((err) => console.log(err.message));
  };
  confirmRating = (x) => {
    x.ref
      .updateMetadata({
        customMetadata: {
          ageAppropriate: true
        },
        metadata: {
          description: "no description",
          modified: new Date()
        }
      })
      .then(() => {
        this.props.unloadGreenBlue();
        var folderReference = `personalCaptures/${this.props.auth.uid}`;
        //this.props.getFolders(folderReference);
        var pathReference = `${folderReference}/${"*"}`;
        this.props.getVideos(pathReference);
      })
      .catch((err) => console.log(err.message));
  };
  applyApropos = (x) => {
    this.props.loadGreenBlue("sending to deepai for rating...");
    x.ref
      .updateMetadata({
        customMetadata: {
          public: true
        },
        metadata: {
          description: "no description",
          modified: new Date()
        }
      })
      .then(async () => {
        if (!x.customMetadata || !x.customMetadata.ageAppropriate) {
          this.deepai = window.deepai;
          this.deepai.setApiKey("fbc3602b-4af4-4b5e-81fb-8a4407b75eab");
          var output = await this.deepai.callStandardApi("content-moderation", {
            image: x.gsUrl
          });
          var result = output.output;
          if (result) {
            console.log(result);
            console.log("deepai nudity score " + result.nsfw_score);
            if (result.nsfw_score > 0.7) {
              window.alert(
                "we cannot store this video, it does not pass our nudity test"
              );
              //move to pouchdb
              //delete from cloud storage
            } else if (result.nsfw_score) {
              this.confirmRating(x);
            } else {
              this.revert(x);
              return window.alert(result);
            }
          } else {
            this.revert(x);
            return window.alert(
              "file moderation analysis error, will not add ageAppropriate tag"
            );
          }
        } else {
          this.confirmRating(x);
        }
      })
      .catch((err) => console.log(err.message));
  };
  delete = (x) => {
    var answer = "";
    firebase
      .firestore()
      .collection("chatMeta")
      .where("gsUrl", "==", x.gsUrl)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          answer = window.confirm(
            "delete this from your cloud? 1) we do not have a backup."
          );
        } else {
          let q = 0;
          let references = [];
          querySnapshot.docs.forEach((doc) => {
            q++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              references.push(foo);
            }
          });
          if (
            querySnapshot.docs.length === q &&
            this.state.references !== references
          ) {
            this.setState({ references });
            answer = window.confirm(
              "delete this from your cloud? 1) we do not have a backup. " +
                "2) the following posts will lose this reference forever" +
                references.toString()
            );
          }
        }
      });
    if (answer) {
      var filename = x.name + x.contentType.split("/")[1].toLowerCase();
      var pathReference =
        `personalCaptures/${this.props.auth.uid}/${x.folder}/` + filename;
      var itemRef = this.storageRef.child(pathReference);
      itemRef
        .delete()
        .then((snapshot) => {
          console.log(snapshot);
        })
        .catch((err) => console.log(err.message));
    }
  };
  saveHere = async (x) => {
    console.log(x);
    var topic = this.props.topic ? this.props.topic : "*";
    var message = x.name; //+"."+ x.type.split("/")[1].toLowerCase();
    var pathReference = `${this.props.threadId}/${topic}`;
    var answer = window.confirm(`save ${message} on ${pathReference}`);
    if (answer) {
      firebase
        .firestore()
        .collection(this.props.collection)
        .add({
          message,
          topic,
          type: x.contentType,
          time: new Date(),
          authorId: this.props.auth.uid,
          entityId: this.props.entityId ? this.props.entityId : null,
          entityType: this.props.entityType ? this.props.entityType : "users",
          threadId: this.props.threadId,
          gsUrl: x.gsUrl
        })
        .then(() => {
          console.log(
            `${x.name}.${x.contentType.split("/")[1]}` +
              " added to " +
              `${this.props.threadId}/${x.folder ? x.folder : "*"}`
          );
        })
        .catch((err) => console.log(err.message));

      /*itemRef
              .delete()
              .then(() => {
                // File deleted successfully
                itemRef
                  .put(this.state.blob)
                  .then((snapshot) => {
                    console.log(snapshot);
                    console.log(
                      `${x.name}.${x.type.split("/")[1]}` +
                        " added to " +
                        `${this.props.threadId}/${x.folder}`
                    );
                    this.props.getVideos(pathReference);
                  })
                  .catch((err) => console.log(err.message));*/
    }
  };
  remove = () => {
    firebase
      .firestore()
      .collection("chatMeta")
      .doc(this.props.x.id)
      .delete()
      .then(() => console.log("deleted " + this.props.x.id))
      .catch((err) => console.log(err.message));
  };
  render() {
    const { x } = this.props;
    const { hovered, hoveree } = this.state;
    return (
      <div>
        {
          <div
            onMouseEnter={() => this.setState({ showTitle: true })}
            onMouseLeave={() => this.setState({ showTitle: false })}
            style={{
              borderRadius: "3px",
              padding: "2px",
              textIndent: "23px",
              bottom: "8px",
              fontSize: "8px",
              position: "absolute",
              borderBottom:
                x.customMetadata && x.customMetadata.public
                  ? "2px blue"
                  : "0px solid",
              backgroundColor:
                x.customMetadata && x.customMetadata.ageAppropriate
                  ? "rgb(20,20,230)"
                  : "grey"
            }}
          >
            {this.state.showTitle
              ? x.name
              : x.customMetadata && x.customMetadata.ageAppropriate
              ? "PG"
              : "Not-rated"}
          </div>
        }
        <div
          onMouseEnter={() => this.setState({ hovered: true })}
          onMouseLeave={() => this.setState({ hovered: false })}
          //airplane air plane
          className="fa fa-send-o"
          style={{
            zIndex: "9999",
            color:
              x.customMetadata && x.customMetadata.ageAppropriate
                ? "blue"
                : hovered
                ? "white"
                : "grey",
            borderRadius: "6px",
            padding: "2px",
            left: "8px",
            top: "8px",
            fontSize: "12px",
            position: "absolute",
            backgroundColor: "rgb(20,20,30)"
          }}
          onClick={
            !x.customMetadata || !x.customMetadata.public
              ? () => this.applyApropos(x)
              : () => this.props.threadId && this.saveHere(x)
          }
        />
        <div
          onMouseEnter={() => this.setState({ hoveree: true })}
          onMouseLeave={() => this.setState({ hoveree: false })}
          style={{
            zIndex: "9999",
            color: hoveree ? "white" : "grey",
            borderRadius: "6px",
            padding: "2px",
            right: "8px",
            top: "8px",
            fontSize: "12px",
            position: "absolute",
            backgroundColor: "rgb(20,20,30)"
          }}
          onClick={
            this.props.inCloud ? () => this.delete(x) : () => this.remove()
          }
        >
          &times;
        </div>
        <div
          style={{
            zIndex: "9999",
            color: hoveree ? "white" : "grey",
            borderRadius: "6px",
            padding: "2px",
            right: "8px",
            bottom: "8px",
            fontSize: "12px",
            position: "absolute",
            backgroundColor: "rgb(20,20,30)"
          }}
        >
          {x.vintage}
        </div>
      </div>
    );
  }
}
export default ImageSetting;
