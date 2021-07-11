import React from "react";

class ColorPicker extends React.Component {
  render() {
    if (
      false &&
      this.props.user !== undefined &&
      this.props.user.profilergb === this.state.profilergb
    ) {
      return null; /* <div>
          {this.props.user !== undefined &&
            this.props.user.profilergb === this.state.profilergb && (
              <ColourWheel
                radius={100}
                padding={5}
                lineWidth={25}
                onColourSelected={(profilergb) =>
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(this.props.auth.uid)
                    .update({ profilergb })
                }
                onRef={(ref) => (this.colourWheel = ref)}
                spacers={{
                  colour: "#FFFFFF",
                  shadowColour: "grey",
                  shadowBlur: 5
                }}
                preset
                presetColour={this.state.profilergb}
                animated
              />
            )}
        </div>*/
    } else return null;
  }
}
export default ColorPicker;
