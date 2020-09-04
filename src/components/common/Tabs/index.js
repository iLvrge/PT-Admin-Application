import React from "react";
import { Tab, Tabs } from "@material-ui/core";
import useStyles from "./styles";

function TabsContainer(props) {
  const classes = useStyles();

  return (
    <div className={classes.tabsWrapper}>
      <Tabs
        value             = {props.activeTabId}
        onChange          = {(e, id) => props.setActiveTabId(id)}
        TabIndicatorProps = {{style: {height: 0}}}
        className         = {classes.tabs}
      >
        {
          props.tabs && props.tabs.map(
            (tab, index) =>
              <Tab
                key       = {tab}
                label     = {tab}
                className = {classes.tabItem}
                style     = {{
                  background: props.activeTabId === index  ? '#222' : 'black',
                  color:  '#bdbdbd',
                  borderBottom: `1.5px solid ${props.activeTabId === index ? '#2493f2' : '#363636'}`
                }}
              />
          )
        }
      </Tabs>
    </div>
  );
}

export default TabsContainer;
