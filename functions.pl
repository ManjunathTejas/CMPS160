
not(X) :- 
   X, 
   !, fail.
not(_).

radian_min_degree(degmin(Degrees, Minutes), Rads) :-
    Degs is Degrees + Minutes / 60,
    Rads is Degs * pi / 180.

haversine_radians(Latitude1, Longitude1, Latitude2, Longitude2, Distance) :-
   LongitudeDist is Longitude2 - Longitude1,
   LatitudeDist is Latitude2 - Latitude1,
   A is sin(LatitudeDist / 2) ** 2
      + cos(Latitude1) * cos(Latitude2) * sin(LongitudeDist / 2) ** 2,
   Dist is 2 * atan2(sqrt(A), sqrt(1 - A)),
   Distance is Dist * 3961. 

time_hours(time(Hours, Mins), TotalHours) :-
    TotalHours is Hours + Mins / 60.

miles_to_hours(Miles, Hours) :-
    Hours is Miles / 500.

print_vals(Timevals) :-
    Timevals < 10, 
    print(0), 
    print(Timevals).

print_vals(Timevals) :-
    Timevals >= 10, 
    print(Timevals).

time_print(TotalHours) :-
    Minvals is floor(TotalHours * 60),
    Hours is Minvals // 60,
    Mins is Minvals mod 60,
    print_vals(Hours), 
    print(':'), 
    print_vals(Mins).

print_info([]) :-
    nl.
    
print_info([[Initial, DepartureTime, ArrivalTime], Post | []]) :-
    airport(Initial, DepartureExtention, _, _), airport(Post, ArrivalExtention, _, _),
    write('depart  '),
    write(Initial), 
    write('  '),
    write(DepartureExtention), 
    time_print(DepartureTime), 
    nl,
    write('arrive  '),
    write(Post), 
    write('  '),
    write(ArrivalExtention), 
    time_print(ArrivalTime), 
    nl,
    !, true.

print_info([[Initial, DepartureTime, ArrivalTime], 
  [Post, PostDepartureTime, PostArriveTime] | Final]) :-
    airport(Initial, DepartureExtention, _, _), airport(Post, ArrivalExtention, _, _),
    write('depart  '),
    write(Initial), 
    write('  '),
    write(DepartureExtention), 
    time_print(DepartureTime), 
    nl,
    write('arrive  '),
    write(Post), 
    write('  '),
    write(ArrivalExtention), 
    time_print(ArrivalTime), 
    nl,
    !, print_info([[Post, PostDepartureTime, PostArriveTime] | Final]).

fly(Departure, Departure) :-
   write('Error, the departure and arrival of the flights are the same.'),
   nl,
   !, fail.

fly(Departure, Arrival) :-
   airport(Departure, _, _, _),
   airport(Arrival, _, _, _),

   check_fly_plan(Departure, Arrival, [Departure], List, _),
   !, nl,
   print_info(List),
   true.

fly(Departure, Arrival) :-
   airport(Departure, _, _, _),
   airport(Arrival, _, _, _),
   write(''),
   !, fail.

fly(_, _) :-
   write('Error, the airports do not exist.'), nl,
   !, fail.

distance(Port1, Port2, Distance) :-
   airport(Port1, _, Latitude1, Longitude1),
   airport(Port2, _, Latitude2, Longitude2),
   radian_min_degree(Latitude1, Latitude1_value),
   radian_min_degree(Latitude2, Latitude2_value),
   radian_min_degree(Longitude1, Longitude1_value),
   radian_min_degree(Longitude2, Longitude2_value),
   haversine_radians(Latitude1_value, Longitude1_value, Latitude2_value,
        Longitude2_value, Distance).

check_fly_plan(Hub, Hub, _, [Hub], _).

check_fly_plan(Previous, Hub, Traveled, 
   [[Previous, Departure, Arrival] | List], HourMinDeparture) :-
   flight(Previous, Hub, HourMinDeparture),
   not(member(Hub, Traveled)),
   time_hours(HourMinDeparture, Departure),
   distance(Previous, Hub, FlightDist),
   miles_to_hours(FlightDist, Difference),
   Arrival is Departure + Difference,
   Arrival < 24.0,
   check_fly_plan(Hub, Hub, [Hub | Traveled], List, _).

check_fly_plan(Previous, Hub, Traveled, 
   [[Previous, Departure, Arrival] | List], HourMinDeparture) :-
   flight(Previous, Next, HourMinDeparture),
   not(member(Next, Traveled)),
   time_hours(HourMinDeparture, Departure),
   distance(Previous, Next, FlightDist),
   miles_to_hours(FlightDist, Difference),
   Arrival is Departure + Difference,
   Arrival < 24.0,
   flight(Next, _, NextHourMinDeparture),
   time_hours(NextHourMinDeparture, NextDeparture),
   Adjust is NextDeparture - Arrival - 0.5,
   Adjust >= 0,
   check_fly_plan(Next, Hub, [Next | Traveled], 
      List, NextHourMinDeparture).
