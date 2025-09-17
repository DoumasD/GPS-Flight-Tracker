from geopy.point import Point
from geopy.distance import great_circle
import numpy as np
import math
import serial
import time
import sys

def get_bearing(lat1,lon1,lat2,lon2):
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    dLon = lon2_rad - lon1_rad;
    y = math.sin(dLon) * math.cos(lat2_rad);
    x = math.cos(lat1_rad)*math.sin(lat2_rad) - math.sin(lat1_rad)*math.cos(lat2_rad)*math.cos(dLon);
    brng = np.rad2deg(math.atan2(y, x));
    if brng < 0: brng+= 360
    return brng

def generate_gps_data_between_two_points(long1, lat1,long2,lat2, height):
   start_point = Point(lat1,long1)
   end_point = Point(lat2,long2)
   print(start_point)
   print(end_point)

   distance_meters = great_circle(start_point, end_point).meters
   bearing = get_bearing(lat1,long1,lat2,long2)

   dist = distance_meters
   h = height
   a = -4 * h / (dist ** 2)
   b = 4 * h / dist


   gps_track = []
   steps = 1000
   for i in range(steps + 1):
       x = (dist / steps+1) * i
       y = a * (x ** 2) + b * x
       temp_point = great_circle(meters=x).destination(start_point, bearing=bearing)
       new_point = great_circle(meters=y).destination(temp_point, bearing=bearing+90 )
       gps_track.append((new_point.latitude, new_point.longitude))

   # Create Altitude
   num_points = steps+1
   max_altitude = height
   x = np.linspace(0, 1, num_points)
   altitudes = -4 * max_altitude * (x - 0.5) ** 2 + max_altitude
   altitudesNonNeg =[max(0, alt) for alt in altitudes]

   full_gps_data = []
   for i in range(len(gps_track)):
       lat, lon = gps_track[i]
       alt = altitudesNonNeg[i]
       formatted_altitude = f"{alt:.1f}"
       full_gps_data.append({"latitude": lat, "longitude": lon, "height":float(formatted_altitude)})

   return full_gps_data

if __name__ == '__main__':

    long1 = sys.argv[1]
    lat1 = sys.argv[2]
    long2 = sys.argv[3]
    lat2= sys.argv[4]
    height = sys.argv[5]
    port = sys.argv[6]
    
    gps_track=generate_gps_data_between_two_points(float(long1), float(lat1),float(long2),float(lat2), int(height))

    s = serial.Serial(port,9600)

    for x in (gps_track):
      res = s.write(str( x).encode() + b'\n')
      print(res)
      time.sleep(1)

    s.close()



