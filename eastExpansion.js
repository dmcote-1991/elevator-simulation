/* East Expansion (24 floors, 2 elevators) */

// Define Elevator class to manage individual elevator behaviors and state
class Elevator {
  constructor(id, idleFloor, defaultDirection) {
    this.id = id; // Unique identifier for the elevator
    this.currentFloor = idleFloor; // Current floor the elevator is on
    this.idleFloor = idleFloor; // Floor where the elevator returns when idle
    this.defaultDirection = defaultDirection; // Default direction for the elevator when no requests (ex: "up" or "down" during rush hours)
    this.currentDirection = defaultDirection; // Current direction the elevator is set to move in
    this.weightCapacity = 0; // Simulated weight capacity, represented as a percentage (0% to 100%)
    this.isMoving = false; // Boolean flag indicating if the elevator is in motion
  }

  // Reset elevator to its default idle state
  reset() {
    this.currentDirection = this.defaultDirection; // Restore the default direction
    this.currentFloor = this.idleFloor; // Move the elevator back to its idle floor
    this.isMoving = false; // Set the elevator's movement status to idle
  }

  // Simulate moving the elevator to a target floor
  async moveToFloor(targetFloor) {
    // Mark the elevator as being in motion
    this.isMoving = true; 
    console.log(`Elevator ${this.id} moving from Floor ${this.currentFloor} to Floor ${targetFloor}`);
    // Simulate travel time based on the floor distance (1 second per floor)
    await new Promise(resolve => setTimeout(resolve, Math.abs(targetFloor - this.currentFloor) * 1000));
    // Update the current floor to the target floor
    this.currentFloor = targetFloor; 
    console.log(`Elevator ${this.id} reached Floor ${targetFloor}`);
    // Mark the elevator as idle after reaching the target
    this.isMoving = false; 
  }
}

// Initialize two elevator instances
const elevator1 = new Elevator(1, 8, "any"); // Elevator 1 starts idle on Floor 8
const elevator2 = new Elevator(2, 17, "any"); // Elevator 2 starts idle on Floor 17
const elevators = [elevator1, elevator2]; // Store elevators in an array for easy management

// Check traffic flow patterns and adjust elevator behavior for rush hours
function trafficFlowCheck() {
  const currentTime = new Date(); // Get the current time
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  const isMorningRush = (currentHour === 7 && currentMinutes >= 30) || (currentHour === 8) || (currentHour === 9 && currentMinutes <= 30); // Determine if it's morning rush hour (7:30 AM - 9:30 AM)
  const isEveningRush = (currentHour === 15 && currentMinutes >= 30) || (currentHour === 16) || (currentHour === 17 && currentMinutes <= 30); // Determine if it's evening rush hour (3:30 PM - 5:30 PM)

  if (isMorningRush) {
    // Morning rush: Elevator 1 is set to "up" only and to idle at Floor 1; Elevator 2 is set to idle at Floor 12
    console.log("Morning rush detected: Adjusting elevator settings.");
    elevator1.currentDirection = "up";
    elevator1.idleFloor = 1;
    elevator2.idleFloor = 12;
  } else if (isEveningRush) {
    // Evening rush: Elevator 2 is set to "down" only and to idle at Floor 24; Elevator 1 is set to idle at Floor 13
    console.log("Evening rush detected: Adjusting elevator settings.");
    elevator2.currentDirection = "down";
    elevator2.idleFloor = 24;
    elevator1.idleFloor = 13;
  } else {
    // Non-rush hour: Reset elevators to default settings
    console.log("No rush hour: Resetting elevators to default settings.");
    elevators.forEach(elevator => elevator.reset());
  }
}

// Check elevator availability and assign one to the requested floor
async function elevatorStateCheck(requestedFloor, direction) {
  // Filter elevators by direction compatibility and movement status
  let availableElevators = elevators.filter(elevator => 
    elevator.currentDirection === "any" || elevator.currentDirection === direction || !elevator.isMoving
  );

  // Filter elevators by weight capacity (ignore overload elevators)
  availableElevators = availableElevators.filter(elevator => elevator.weightCapacity < 90);

  // Sort available elevators from closest to furthest from the requested floor
  availableElevators.sort((a, b) => Math.abs(a.currentFloor - requestedFloor) - Math.abs(b.currentFloor - requestedFloor));

  if (availableElevators.length > 0) {
    const selectedElevator = availableElevators[0]; // Choose the closest available elevator
    await selectedElevator.moveToFloor(requestedFloor); // Move the selected elevator to the requested floor
    selectedElevator.reset(); // Reset the elevator state
    trafficFlowCheck(); // Check traffic flow to update the elevator settings if needed
  } else {
    // If no elevators are available, retry after 1 second
    console.log("No available elevators. Retrying...");
    setTimeout(() => elevatorStateCheck(requestedFloor, direction), 1000);
  }
}

// Simulate a button press for elevator service
async function buttonPressed(floor, direction) {
  console.log(`Button pressed at Floor ${floor} for direction '${direction}'`);
  await elevatorStateCheck(floor, direction);
}

// Main entry point to run the elevator system
function start() {
  trafficFlowCheck(); // Initial traffic flow to check to configure elevators based on the time

  // Simulate button presses at different times and locations
  setTimeout(() => buttonPressed(3, "up"), 2000); // Button pressed at Floor 3 for "up"
  setTimeout(() => buttonPressed(2, "down"), 4000); // Button pressed at Floor 2 for "down"
}

start();
