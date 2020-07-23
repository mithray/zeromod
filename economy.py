#!/usr/bin/python3

town_structure_cost = 100 + 50 # 100 wood + 50 build time
city_structure_cost = 200 + 100 # 200 wood + 100 build time

starting_food = 300
starting_wood = 300

no_required_structures = 5
town_phase_structure_costs = no_required_structures * town_structure_cost
city_phase_structure_costs = no_required_structures * city_structure_cost
starting_resources = starting_food + starting_wood
town_phase_cost = 1000
city_phase_cost = 1500
starting_workers = 9

structure_costs = town_phase_structure_costs  + city_phase_structure_costs
phase_tech_costs = town_phase_cost  + city_phase_cost

def test(n):
  sum = 0
  time = 0
  total_time = time
  for x in range(0, n):
      time = 8 * x
      total_time = total_time + time
  return total_time

lowest_advance_time = 99999999
number_for_lowest_advance = 0

for count in range(0, 40):

#  print(count)
  s = starting_workers
  n = count
  collection_rate = .7
  workers = s + n
  worker_collection_rate = workers * collection_rate
  worker_collection_delay= test(n)

  total_workers_cost = n * 50
  required_resources = structure_costs + phase_tech_costs + total_workers_cost - starting_resources
  time_phase = ( required_resources + worker_collection_delay ) / ( worker_collection_rate )

  if time_phase < lowest_advance_time:
    lowest_advance_time = time_phase
    number_for_lowest_advance = n


print(lowest_advance_time)
print(number_for_lowest_advance)
#  print(worker_collection_delay)
# print(time_phase)

