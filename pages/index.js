import Profile from ".././src/Profile";
import Community from ".././src/Community";
import PlansByName from ".././src/components/Plans/Plans/PlansByName";
import Nothing from ".././src/Nothing";
import DropId from ".././src/DropId";
import Planner from ".././src/components/Plans/Planner";
import CreateEvent from ".././src/components/eventpagesredux/CreateEvent";
import Eventopenredux from ".././src/components/eventpagesredux/eventopenredux";
import Eventedmopen from ".././src/widgets/tools/eventedmopen";
import PlanOpen from ".././src/components/Plans/PouchDBpages/planopen";
import PlanEdit from ".././src/components/Plans/PouchDBpages/planedit";
import Login from "../src/Login";

export default [
  {
    path: "/newevent",
    component: CreateEvent, //() => Promise.resolve(<CreateEvent />), //new Promise((resolve) => resolve(<CreateEvent />)),
    exact: true
  },
  {
    path: "/newclub",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/newshop",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/newrestaurant",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/newservice",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/newjob",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/newhousing",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/newpage",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/newvenue",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/budget",
    component: Planner,
    exact: true
  },
  {
    path: "/calendar",
    component: Planner,
    exact: true
  },
  {
    path: "/invites",
    component: Planner,
    exact: true
  },
  {
    path: "/plan",
    component: Planner,
    exact: true
  },
  {
    path: "/events",
    component: Planner,
    exact: true
  },
  {
    path: "/jobs",
    component: Planner,
    exact: true
  },
  {
    path: "/sd/:id/:id1",
    component: Planner,
    exact: true
  },
  {
    path: "/bk/:id",
    component: Planner,
    exact: true
  },
  {
    path: "/at/:id",
    component: Profile,
    exact: true
  },
  {
    path: "/co/:id",
    component: Community,
    exact: true
  },
  {
    path: "/plans/:id",
    component: PlansByName,
    exact: true
  },
  {
    path: "/plan/:id",
    component: PlanOpen,
    exact: true
  },
  {
    path: "/plan/:id/edit",
    component: PlanEdit,
    exact: true
  },
  {
    path: "/events/edmtrain/:id",
    component: Eventedmopen,
    exact: true
  },
  {
    path: "/event/:id",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/clubs/:id/:id1",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/shops/:id/:id1",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/restaurants/:id/:id1",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/services/:id/:id1",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/departments/:id/:id1",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/classes/:id/:id1",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/classes/:id/:id1/:id2",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/job/:id",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/housing/:id",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/pages/:id/:id1",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/venues/:id/:id1",
    component: Eventopenredux,
    exact: true
  },
  {
    path: "/new",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/new:/id",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/new/:id/:id1",
    component: CreateEvent,
    exact: true
  },
  {
    path: "/login",
    component: Login,
    exact: true
  },
  {
    path: "/",
    component: Nothing,
    exact: true
  },
  {
    path: "/:id",
    component: DropId,
    exact: true
  },
  {
    path: "/*",
    component: <div>404: unconceived page</div>,
    exact: false
  }
];
