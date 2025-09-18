# Project Name: GPS Flight Tracker

# Description:
Track electronic devices that contains GPS data ranging from a drone, can-sized satellite, or a rocket. This software was designed for hobbyist. I used a third party software known as CesiumJS to plot 3D GPS data on Earth. The angular frame-work is used to serve a custom made cesium-angular web application. The back-end uses nodeJS server. This software was designed on Linux OS.

# Instructions to run this angular app:
1.) Clone the repository, make sure to run npm install to get the node_modules folder with the third party software.
2.) Run the back-end software by opening a terminal in the back-end directory and run node server.js.
3.) In a terminal that has angular-cli installed, run ng serve -o to run the front-end under the myCesium directory.
4.) In a separate terminal create a tunnel between two USB ports for instance:
      
      sudo socat -d -d PTY,raw,echo=0,link=/dev/ttyS15,mode=777 PTY,raw,echo=0,link=/dev/ttyS4,mode=77

Note: socat may need to be installed in your terminal/
5.) Select one serial port of the tunnel on the front-end, type the buadrate and click start.
6.) Run the python script called "generate_emit_gps_data.py" in a separate terminal under the python_script directory.

The arguments after the name of the python script are the following: long1, lat1, long2, lat2, height (in integer), name of the port.

The GPS data should be generated, sent through  the tunnel to the back-end of the app, and shown on the globe.

# Usage
You can zoom into an area of interest on the globe, where serial data will start plotting on the globe. The mouse wheel is used to zoom in and out of the globe. Dragging the globe rotates the globe. Pressing Ctrl and dragging the mouse changes the camera angle. Pressing the clear button will clear the globe allowing to rest the globe from the beginning.

# Credit

Demetrios Doumas
