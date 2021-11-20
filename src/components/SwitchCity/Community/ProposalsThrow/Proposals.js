/*import React from "react";
import ProposalsHeader from "./ProposalsHeader";
//import TilesSlideDrawer from ".././Tiles/TilesSlideDrawer";
//import TilesBackdrop from ".././Tiles/TilesBackdrop";
import ProposalTypesBackdrop from ".././ProposalTypes/ProposalTypesBackdrop";
import ProposalTypes from ".././ProposalTypes/ProposalTypes";
import "./Proposals.css";
import convert from "xml-js";
import XMLParser from "react-xml-parser";

let last_known_scroll_position = 0;
let ticking = false;
class Proposals extends React.Component {
  state = {
    search: "",
    date: new Date(),
    drawerOpen: false,
    proposalTypesOpen: false,
    switchCommunitiesOpen: false,
    bills: [],
    prevOffset: 9990
  };

  drawerToggleClickHandler = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  };
  backdropClickHandler = () => {
    this.setState({
      drawerOpen: false
    });
  };
  proposalTypesOpener = () => {
    this.setState({
      proposalTypesOpen: !this.state.proposalTypesOpen
    });
  };
  eventTypesCloser = () => {
    this.setState({
      proposalTypesOpen: false
    });
  };
  switchCommunitiesOpener = () => {
    this.setState({
      switchCommunitiesOpen: !this.state.switchCommunitiesOpen
    });
  };
  switchCommunitiesCloser = () => {
    this.setState({
      switchCommunitiesOpen: false
    });
  };
  updateSearch = async event => {
    this.setState({ search: event.target.value.substr(0, 20) });
  
    await fetch('https://openstates.org/graphql/jurisdictions&api_key=f6d51945-d31e-47f6-8e4b-13f8348d5b4a')
    .then(async response => {
      const results = await response.json()
    console.log(results)
    this.setState({statebills: results.packages})
    })
    .catch((error) => 
      console.log(error)
    )
  //console.log(this.state.bills)

  componentDidMount = async () => {
    await fetch(
      "https://cors-anywhere.herokuapp.com/https://api.govinfo.gov/collections/BILLS/2018-01-03T00%3A00%3A00Z?offset=0&pageSize=3&congress=116&api_key=h117c5VnhjOhrVOi5xxP2uF21ffX6gkQTUF1AL8E" {
        params: { offset:8888,
          pageSize:10,
          congress:116,
          api_key:"h117c5VnhjOhrVOi5xxP2uF21ffX6gkQTUF1AL8E" }
      }
    )
      .then(async response => await response.json())
      .then(async results => {
        //console.log(results);
        await fetch(
          "https://www.govinfo.gov/bulkdata/BILLSTATUS/116/hr/BILLSTATUS-116hr5120.xml",{
            mode: 'no-cors'
        }
        )
          .then(res => {
            var xml = new XMLParser().parseFromString(`${res}`);
            console.log()
            var done = xml.getElementsByTagName("actions").item("item");
            console
              .log(done)
              .then(resul => {
                console.log(resul);
              })
              .catch(error => console.log(error));
          })
          .catch(error => {
            console.log("2" + error);
            this.setState({ bills: [] });
          });
        this.setState({ bills: results.packages });
        this.props.updateBills(results);
      });
    //window.addEventListener('scroll', this.handleScroll);
  };
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  loadMoreBills = async () => {
    await fetch(
      `https://api.govinfo.gov/collections?api_key=h117c5VnhjOhrVOi5xxP2uF21ffX6gkQTUF1AL8E`
    )
      .then(response => response.json())
      .then(results => {
        results.collections.map(x => {
          if(x.collectionCode === "BILLS"){
            this.setState({billCount: x.packageCount})
          }
        })
      })
      .catch(error => {
      });
    this.setState({
      prevOffset: this.state.prevOffset - 10
    });
    const thisone = this.state.prevOffset - 10;
    const lastYear = new Date(new Date().getFullYear -1, new Date().getMonth(), new Date().getDate()).toISOString()
    await fetch(
      `https://cors-anywhere.herokuapp.com/https://api.govinfo.gov/collections/BILLS/${lastYear}?offset=${thisone}&pageSize=10&congress=116&api_key=h117c5VnhjOhrVOi5xxP2uF21ffX6gkQTUF1AL8E`
    )
      .then(response => response.json())
      .then(results => {
        console.log(results);
        this.setState({ bills: [...this.state.bills, ...results.packages] });
        this.props.updateBills(results.packages);
      })
      .catch(error => {
        console.log("2" + error);
        this.setState({ bills: this.state.bills });
      });
  };
  onScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      this.props.list.length
    ) {
      this.props.onPaginatedSearch();
    }
  };
  render() {
    //console.log(this.state.bills)
    let backdrop;
    if (this.state.drawerOpen) {
      backdrop = <TilesBackdrop close={this.backdropClickHandler} />;
    }
    let backdrop1;
    if (this.state.proposalTypesOpen) {
      backdrop1 = (
        <ProposalTypesBackdrop eventTypesCloser={this.eventTypesCloser} />
      );
    }
    return (
      <React.Fragment>
        <ProposalsHeader
          toggle={this.drawerToggleClickHandler}
          proposalTypesOpener={this.proposalTypesOpener}
          search={this.state.search}
          proposalTypesOpen={this.state.proposalTypesOpen}
          switchCommunitiesOpen={this.state.switchCommunitiesOpen}
          switchCommunitiesOpener={this.switchCommunitiesOpener}
          updateSearch={this.updateSearch}
        />

        <TilesSlideDrawer show={this.state.drawerOpen} />
        {backdrop}
        <ProposalTypes proposalTypesOpen={this.state.proposalTypesOpen} />
        {backdrop1}
        <div className="proplistredux">
          {this.state.bills.length > 0
            ? this.state.bills.map(event => (
                <Proposal
                  billSelected={this.props.billSelected}
                  event={event}
                />
              ))
            : <div>Loading</div>}
          <br />
          <br />
          <div onClick={this.loadMoreBills}>
          <br />load more bills</div>
          <br />
          <br />
          <br />
          <br />
        </div>

        {this.state.switchCommunitiesOpen ? (
          <HolderSwitchCommunities
            switchCommunitiesCloser={this.switchCommunitiesCloser}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default Proposals;

/*
const mapStateToProps = state => {
  return {
    proposals: state.firestore.ordered.proposals
  };
};

export const PAGEINATE_PROPOSALS = {
  now: "startAt: new Date(new Date().setDate(new Date().getDate()-1)",
  previous: "endAt: new Date()"
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "proposals", orderBy: ['date'], startAt: new Date(new Date().setDate(new Date().getDate()-1))
    },
    //`equalTo=${props.date.seconds}`
  ])
)(Proposals);
//.sort((a, b) => new Date(b.plan.date) - new Date(a.plan.date))
*/
