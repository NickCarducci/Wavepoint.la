//var GOOGLE_CLIENT_ID =
//"782099731386-homnqho2840h3kdvarjsavsmnp9bqak4.apps.googleusercontent.com";
//var GOOGLE_API_KEY = "AIzaSyAs9BpsQZFolkkBn4ShDTzb1znu_7JM894";

//var GOOGLE_DISCOVERY_DOCS =
//"https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
//"https://www.googleapis.com/discovery/v1/apis/drive/v3/rest " +
//"https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";

//var GOOGLE_SCOPES = "https://www.googleapis.com/auth/drive.file";
//"https://www.googleapis.com/auth/drive.file "+
//"https://www.googleapis.com/auth/youtube.force-ssl";
//'https://www.googleapis.com/auth/drive.metadata.readonly';
//var touchTarget, touchScreenX, touchScreenY, disableScroll, scrollMap;
// Initialize deferredPrompt for use later to show browser install prompt.

/*
  signOut1 = () => {
    console.log("trying to sign out");
    this.gapi = window.gapi;
    if (this.gapi) {
      //console.log(auth2);
      this.auth2 = window.auth2;
      this.auth2
        .signOut()
        .then(() => {
          //if (auth2 !== null) {
          console.log("outted successfully");
          this.auth2.disconnect();
        })
        .catch((err) => console.log(err.message));
      this.auth2.disconnect();
      //this.logout();
    }
  };
  signOut = () => {
    if (this.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      //console.log(auth2);
      auth2
        .signOut()
        .then((auth2) => {
          if (auth2 != null) {
            auth2.disconnect();
          }
        })
        .catch((err) => console.log(err.message));
    }
  };
const switchAccount = () => {
  console.log("trying to switch account");
  this.loadGapiApi(true);
  /*this.gapi = window.gapi;
    this.gapi.auth2
      .getAuthInstance()
      .signIn({
        api_key: GOOGLE_API_KEY,
        client_id: GOOGLE_CLIENT_ID
        scope: GOOGLE_SCOPES,
        prompt: "select_account"
      })
      .then(() => {
        //if (auth2 !== null) {
        console.log("outted successfully");
        this.auth2.disconnect();
      })
};
const pickerCallback1 = (data) => {
  if (data.action === window.google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    //console.log(fileId);
    //console.log(window.gapi);
    //console.log(data.docs[0].name);
    this.s.setItemIds([fileId]);
    if (this.state.filesPreparedToSend !== data.docs) {
      //console.log(data.docs);
      this.setState({ filesPreparedToSend: data.docs });
    }
  }
};
const pickerCallback = (data) => {
  if (data.action === window.google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    //console.log(fileId);
    //console.log(window.gapi);
    //console.log(data.docs[0].name);
    this.s.setItemIds([fileId]);
    if (this.state.filesPreparedToSend !== data.docs) {
      //console.log(data.docs);
      this.setState({ filesPreparedToSend: data.docs });
    }
  }
};
const pickerCallback2 = (data) => {
  if (data.action === window.google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    //console.log(fileId);
    //console.log(window.gapi);
    //console.log(data.docs[0].name);
    this.s.setItemIds([fileId]);
    if (this.state.filesPreparedToSend !== data.docs) {
      //console.log(data.docs);
      this.setState({ filesPreparedToSend: data.docs });
    }
  }
};

this.gapi.client.load(
                "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
                () => console.log("youtube loaded")
              );
const loadSignIn = () => {
  this.gapi = window.gapi;

  var opts = {
    scope: GOOGLE_SCOPES,
    theme: "dark",
    width: 200,
    borderRadius: 10,
    border: "thin solid #888",
    boxShadow: "1px 1px 1px grey",
    height: 56,
    position: "relative",
    onsuccess: (e) => this.loadGapiApi(e),
    onfailure: (e) => console.log(e),
    prompt: "select_account"
  };
  //this.gapi.signin2.render("loginButton", opts);
  this.gapi.signin2.render(this.loginButton.current, opts);
};


  getFile = async (x) => {
    await fetch(`https://www.googleapis.com/drive/v3/files/${x}`)
      .then(async (x) => await x.json())
      .then((x) => {
        console.log(x);
      })
      .catch((x) => console.log(x));
  };
  async setPreferences(displayPreferences) {
    let res = await this.state.dodb["setPreferences"](
      displayPreferences
    ).catch((err) => console.log(err.message));
    this.setState({
      displayPreferences
    });
    //this.props.history.replace('/plan')
    //this.props.history.replace(`/plans/${res.id}`)
    return res;
  }
  async setScopeCode(key, method) {
    let res = await this.state.sdb[method](key).catch((err) =>
      console.log(err.message)
    );

    this.setState({
      key
    });
    //this.props.history.replace('/plan')
    //this.props.history.replace(`/plans/${res.id}`)
    return res;
  }
  loadGoogleApi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      console.log("google api loaded");
      this.loadGapi();
    };
    document.body.appendChild(script);
  }
  loadGapi = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.onload = () => {
      console.log("google api platform loaded");
      this.loadGapiClient();
    };
    document.body.appendChild(script);
  };
  loadGapiClient = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";
    script.onload = () => {
      console.log("google api client loaded");
      /*this.gapi.client.load("youtube", "v3", () =>
        console.log("loaded youtube")
      );*
      this.gapi = window.gapi;
      this.gapi.load("client:auth2", () => {
        /*this.gapi.load("signin2", () => {
            console.log("render a sign in button");
            // using this method will show Signed In if the user is already signed in
          });*
        console.log("auth2 loaded");
      });
    };
    document.body.appendChild(script);
  };
  loadGapiApi = (x) => {
    //var DIALOG_DIMENSIONS = { width: "90%", height: "90%" };
    this.gapi = window.gapi;
    /*this.gapi.auth2.getAuthInstance().signIn(
      {
        api_key: GOOGLE_API_KEY,
        client_id: GOOGLE_CLIENT_ID
        scope: GOOGLE_SCOPES,
        prompt: "select_account"
      } ); //.then(this.afterSignIn);*
    console.log("authooo");
    this.gapi.auth2.authorize(
      //getAuthInstance().signIn(
      //init(
      //authorize(
      {
        discoveryDocs: GOOGLE_DISCOVERY_DOCS,
        api_key: GOOGLE_API_KEY,
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_SCOPES,
        prompt: x ? "select_account" : "none"
        //prompt: "select_account"
      },
      (authResult) => {
        if (authResult) {
          this.gapi.client.load("drive", "v3", () =>
            console.log("loaded drive")
          );
          /*this.auth2 = this.gapi.auth2.init({
            discoveryDocs: GOOGLE_DISCOVERY_DOCS,
            clientId:
              "782099731386-homnqho2840h3kdvarjsavsmnp9bqak4.apps.googleusercontent.com"
          });*
          console.log("ok");
          this.gapi.load("picker", () => {
            console.log("drive picker loaded");
            this.googlepicker = window.google;

            var view1 = new this.googlepicker.picker.DocsView(
              this.googlepicker.picker.ViewId.IMAGE
            ).setSelectFolderEnabled(true);
            var uploadView1 = new this.googlepicker.picker.DocsUploadView();
            view1.setMode(this.googlepicker.picker.DocsViewMode.LIST);
            view1.setQuery(window.dataFeedName);

            this.picker1 = new this.googlepicker.picker.PickerBuilder()
              .setAppId(GOOGLE_CLIENT_ID)
              .setOAuthToken(authResult.access_token)
              .addView(view1)
              .addView(uploadView1)
              .setOrigin("https://wavepoint.la")
              .setCallback(this.pickerCallback1)
              .build();
            window.picker1 = this.picker1;

            var view2 = new this.googlepicker.picker.DocsView(
              this.googlepicker.picker.ViewId.IMAGE
            ).setSelectFolderEnabled(true);
            var uploadView2 = new this.googlepicker.picker.DocsUploadView();
            view2.setMode(this.googlepicker.picker.DocsViewMode.LIST);
            view2.setQuery(window.dataFeedName);

            this.picker2 = new this.googlepicker.picker.PickerBuilder()
              .setAppId(GOOGLE_CLIENT_ID)
              .setOAuthToken(authResult.access_token)
              .addView(view2)
              .addView(uploadView2)
              .setOrigin("https://wavepoint.la")
              .setCallback(this.pickerCallback2)
              .build();
            window.picker2 = this.picker2;

            var view = new this.googlepicker.picker.DocsView(
              this.googlepicker.picker.ViewId.DOCS
            ).setSelectFolderEnabled(true);
            var uploadView = new this.googlepicker.picker.DocsUploadView();
            view.setMode(this.googlepicker.picker.DocsViewMode.LIST);
            view.setQuery(window.dataFeedName);

            this.picker = new this.googlepicker.picker.PickerBuilder()
              .setAppId(GOOGLE_CLIENT_ID)
              .setOAuthToken(authResult.access_token)
              .addView(view)
              .addView(uploadView)
              //.enableFeature(google.picker.Feature.SIMPLE_UPLOAD_ENABLED)
              //.enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
              .enableFeature(
                this.googlepicker.picker.Feature.MULTISELECT_ENABLED
              ) //optional
              .setOrigin("https://wavepoint.la")
              .setCallback(this.pickerCallback)
              .build();
            window.picker = this.picker;
          });

          this.gapi.load("drive-share", () => {
            console.log("share dialog loaded");
            this.s = window.s;
            this.s = new window.gapi.drive.share.ShareClient();
            this.s.setOAuthToken(authResult.access_token);
          });

          this.setState({
            authResult,
            accessToken: authResult.access_token,
            authorizedScopes: true,
            signedIn: true
          });
          //const auth2 = this.gapi.auth2.getAuthInstance();
          //this.auth2.signIn();
        }
      }
    );
  };
 */
