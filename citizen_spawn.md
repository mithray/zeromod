# Training Speed

Training speed of all units could be based on the number of houses you have, with houses autospawning villages up to the max population supported by those houses.

Alternately, training speed is based on your current population. An equation could be

m=number of males
f=number of female
a=(m+f)/2
d=((m-f)**2)**1/2)

training speed = m * f / 100

If there are too many males or females relative to the other, then training speed will decrease.

To counter the differences that are bound to arise, men could have a 30% higher chancer of spawning than women, and perhaps the difference should be averaged in part, such as

training speed = ((m+d)*(m-d))/400

