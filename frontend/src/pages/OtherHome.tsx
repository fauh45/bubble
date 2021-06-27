import { navigate, RouteComponentProps } from "@reach/router";
import { Box, Text, Button } from "grommet";
import React, { Children } from "react";

// interface OtherHomeProps extends RouteComponentProps {
//   end?: boolean; // Optional Props
//   amazingNumber?: number; // Optional Props
// }

// // Optional Props can have their default value set
// const defaultProps: OtherHomeProps = {
//   amazingNumber: 420,
//   end: true,
// };

// const OtherHome: React.FC<OtherHomeProps> = (props) => {
//   const { amazingNumber, end, location, children } = props;
//   return (
//     <Box direction="column" align="center">
//       <Text color="neutral-1" size="3xl">
//         Hello Welcome to {location?.pathname.replace("/", "")}!
//       </Text>
//       <Text>Amazing number is {amazingNumber}</Text>

//       {end ? (
//         <Button
//           type="button"
//           primary
//           margin="medium"
//           onClick={() => navigate("/")}
//           label={"Navigate to Home"}
//         />
//       ) : null}
//       {children}
//     </Box>
//   );
// };


interface Props extends RouteComponentProps{
  title:string;
}

class OtherHome extends React.Component<Props> {
  title = "gajah";
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {this.props.children}
        <Button
          type="button"
          primary
          margin="medium"
          onClick={() => navigate("/")}
          label={"Navigate to Home"}
        />
      </div>
    );
  }
}


// Set the default props here
// OtherHome.defaultProps = defaultProps;

export default OtherHome;
