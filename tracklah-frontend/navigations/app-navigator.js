import { createDrawerNavigator } from "@react-navigation/drawer";
import AddExpenses from "../containers/App/AddExpenses";
import Home from "../containers/App/Home";
import ViewPie from "../containers/App/ViewPie";
import ViewBar from "../containers/App/ViewBar";
import colors from '../styles/colors'

const AppStack = createDrawerNavigator();

export default function AppNav(){
    return(
        <AppStack.Navigator tabBar={()=>null} initialRouteName="home" screenOptions={{headerStyle: {
            backgroundColor: colors.mainBackground,
          }}}>
            <AppStack.Screen name = "Overview" component = {Home} />
            <AppStack.Screen name = "addExpenses" component = {AddExpenses} />
            <AppStack.Screen name = 'Expenses Pie Chart' component={ViewPie} />
            <AppStack.Screen name = 'Income and Expenses Bar Chart' component={ViewBar} />
        </AppStack.Navigator>
    )
};