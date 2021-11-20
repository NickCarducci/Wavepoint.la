import React from "react";

class CommunityMembersAnim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvass = React.createRef();
    //canvas properties
  }
  componentWillUnmount = () => {
    window.cancelAnimationFrame(this.update);
  };
  componentDidUpdate = () => {
    this.ctx = this.canvass.current.getContext("2d");
    if (this.props.users && this.props.community) {
      [
        this.props.community.members,
        this.props.community.faculty,
        this.props.community.admin,
        this.props.community.authorId
      ].map((b) => {
        return [b].forEach((v) => {
          var thisone = this.props.users.find((y) => y.id === v);
          if (thisone) {
            var imageObj1 = new Image();
            imageObj1.src = thisone.photoThumbnail;
            imageObj1.style.zIndex = "9999";
            //document.body.appendChild(imageObj1);
            imageObj1.onload = () => {
              //ball properties
              var width = this.props.width;
              var height = this.props.height;
              var gravity = 0.25;
              var friction = 0.98;
              var bounce = 0.9;
              var radius = this.props.width / 9;
              var velX = 7 * (Math.floor(Math.random() * 2) || -1);
              var velY = 0.25 * (Math.floor(Math.random() * 2) || -1);
              var x = 0;
              var y = 0;
              window.requestAnimationFrame(() =>
                this.update(
                  thisone,
                  {
                    width,
                    height,
                    gravity,
                    friction,
                    bounce,
                    radius,
                    velX,
                    velY,
                    x,
                    y
                  },
                  this.ctx,
                  imageObj1
                )
              );
            };
          }
        });
      });
    }
  };

  update(thisone, m, ctx, image) {
    var {
      width,
      height,
      gravity,
      friction,
      bounce,
      radius,
      velX,
      velY,
      x,
      y
    } = m;
    // queue the next update,clear,update,draw
    ctx.clearRect(0, 0, width, height);

    // bottom bound / floor
    if (y + radius >= height) {
      velY *= -bounce;
      y = height - radius;
      velX *= friction;
    }
    // top bound / ceiling
    if (y - radius <= 0) {
      velY *= -bounce;
      y = radius;
      velX *= friction;
    }
    // left bound
    if (x - radius <= 0) {
      velX *= -bounce;
      x = radius;
    }
    // right bound
    if (x + radius >= width) {
      velX *= -bounce;
      x = width - radius;
    }
    // reset insignificant amounts to 0
    if (velX < 0.01 && velX > -0.01) {
      velX = 0;
    }
    if (velY < 0.01 && velY > -0.01) {
      velY = 0;
    }
    // update position
    velY += gravity;
    x += velX;
    y += velY;
    window.requestAnimationFrame(() =>
      this.update(
        thisone,
        {
          width,
          height,
          gravity,
          friction,
          bounce,
          radius,
          velX,
          velY,
          x,
          y
        },
        ctx,
        image
      )
    );
    /*
    // Save the context so we can undo the clipping region at a later time
    ctx.save();

    // Define the clipping region as an 360 degrees arc at point x and y
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)*/ var g = this
      .canvass.current;
    if (
      this.canvass.current &&
      g.mouseX > x &&
      g.mouseX < image.width &&
      g.mouseY > y &&
      g.mouseY < image.height
    ) {
      console.log("ok");
      g.mousePressed(() => this.props.history.push(`/at/${thisone.username}/`));
    }
    // Clip!
    //ctx.clip();
    ctx.drawImage(image, x, y, 50, 70);
    ctx.font = "30pt Calibri";
    ctx.fillText(thisone.username, x, y, 50, 20);
    //ctx.restore();
  }

  componentDidMount = () => {
    this.canvass.current.width = this.props.width;
    this.canvass.current.height = this.props.height;
  };
  render() {
    return (
      <div
        style={{
          zIndex: "9998",
          margin: "0",
          display: "flex",
          position: "fixed",
          left: "0px",
          top: "190px",
          width: "100vw",
          height: "calc(100vh - 190px)",
          backgroundColor: "rgba(180,230,255,.5)"
        }}
      >
        <canvas ref={this.canvass} />
      </div>
    );
  }
}

export default CommunityMembersAnim;
