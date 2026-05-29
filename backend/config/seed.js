const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Class = require('../models/Class');
const Notice = require('../models/Notice');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database. Cleaning up collections...');

    // Clear existing data
    await User.deleteMany();
    await Plan.deleteMany();
    await Class.deleteMany();
    await Notice.deleteMany();
    
    console.log('Collections cleared. Seeding Membership Plans...');

    // 1. Seed Membership Plans
    const plans = await Plan.create([
      {
        name: 'Basic Power',
        price: 29,
        duration: 1,
        features: [
          'Access to gym floor & weights',
          'Locker room & shower access',
          '1 Complimentary physical evaluation',
          'Free High-speed Gym Wi-Fi'
        ]
      },
      {
        name: 'Premium Elite',
        price: 79,
        duration: 6,
        features: [
          '24/7 Gym access',
          'Access to all group classes & yoga',
          'Dedicated Personal Trainer matching',
          'Customized Workout & Diet Plans',
          'Free premium locker service'
        ]
      },
      {
        name: 'VIP Power Club',
        price: 149,
        duration: 12,
        features: [
          'All Premium Elite benefits included',
          'Private VIP Lounge & SPA access',
          'Unlimited personal trainer checks',
          'Free Juice Bar & high-protein smoothies',
          'Premium towel & laundry service',
          'Bi-weekly bio-impedance body scans'
        ]
      }
    ]);
    console.log(`Seeded ${plans.length} Membership Plans.`);

    // 2. Seed Users (Admin & Trainers)
    console.log('Seeding administrative and trainer accounts...');
    
    // Create Admin
    const adminUser = await User.create({
      name: 'Alpha Gym Administrator',
      email: 'admin@gym.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`Seeded Admin User: ${adminUser.email}`);

    // Create Trainer 1
    const trainer1 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@gym.com',
      password: 'trainer123',
      role: 'trainer',
      trainerSpecialty: 'Bodybuilding & Heavy Strength'
    });
    console.log(`Seeded Trainer 1: ${trainer1.email}`);

    // Create Trainer 2
    const trainer2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@gym.com',
      password: 'trainer123',
      role: 'trainer',
      trainerSpecialty: 'Power Yoga & Core Flex'
    });
    console.log(`Seeded Trainer 2: ${trainer2.email}`);

    // Create a generic member to start with
    const sampleMember = await User.create({
      name: 'John Doe',
      email: 'john@gym.com',
      password: 'member123',
      role: 'member',
      membershipPlan: plans[1]._id, // Premium Elite
      membershipStatus: 'active',
      assignedTrainer: trainer1._id,
      workoutPlan: [
        {
          day: 'Monday',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: '8-10', weight: '80kg' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '26kg' },
            { name: 'Triceps Overhead Extension', sets: 3, reps: '12', weight: '20kg' }
          ]
        },
        {
          day: 'Wednesday',
          exercises: [
            { name: 'Barbell Squats', sets: 4, reps: '8', weight: '100kg' },
            { name: 'Leg Press', sets: 3, reps: '10', weight: '160kg' },
            { name: 'Calf Raises', sets: 4, reps: '15', weight: '80kg' }
          ]
        }
      ],
      dietPlan: [
        {
          day: 'Monday',
          meals: [
            { time: '08:00 AM', food: '4 Egg whites, 1 Whole egg, 70g Oatmeal with berries', calories: 450 },
            { time: '01:00 PM', food: '150g Grilled Chicken Breast, 100g Brown Rice, Steamed Broccoli', calories: 550 },
            { time: '04:00 PM', food: '1 Scoop Whey Protein, 1 Banana', calories: 250 },
            { time: '08:00 PM', food: '180g Baked Salmon, Sweet Potato, Mixed Green Salad', calories: 600 }
          ]
        }
      ]
    });
    console.log(`Seeded Sample Active Member: ${sampleMember.email}`);

    // 3. Seed Gym Classes
    console.log('Seeding gym class schedules...');
    const classes = await Class.create([
      {
        name: 'HIIT Blast & Core',
        trainer: trainer1._id,
        day: 'Monday',
        time: '08:00 AM - 09:30 AM',
        capacity: 15,
        enrolledMembers: [sampleMember._id]
      },
      {
        name: 'Vinyasa Power Flow',
        trainer: trainer2._id,
        day: 'Wednesday',
        time: '10:00 AM - 11:30 AM',
        capacity: 20,
        enrolledMembers: []
      },
      {
        name: 'CrossFit Beast Mode',
        trainer: trainer1._id,
        day: 'Friday',
        time: '05:00 PM - 06:30 PM',
        capacity: 12,
        enrolledMembers: []
      }
    ]);
    console.log(`Seeded ${classes.length} Gym Classes successfully.`);

    // 4. Seed Notices
    console.log('Seeding announcement bulletins...');
    const notices = await Notice.create([
      {
        title: 'Emergency Maintenance Closure',
        content: 'Dear Athletes, our steam SPA room will undergo emergency maintenance on Friday from 10:00 AM to 02:00 PM. The main gym floor remains fully operational.',
        category: 'important'
      },
      {
        title: 'Alpha Powerlifting Cup 2026',
        content: 'Registration is now open for our annual Powerlifting Cup! Categories include Squat, Bench, and Deadlift. Register at the admin desk before June 15.',
        category: 'event'
      },
      {
        title: 'Summer Fuel Nutrition Seminars',
        content: 'Join Coach Sarah Jenkins this Saturday at 03:00 PM in the VIP Lounge for an interactive nutrition workshop covering summer macro targets.',
        category: 'general'
      }
    ]);
    console.log(`Seeded ${notices.length} Notice announcements.`);

    console.log('Database Seeding Completed Successfully! Enjoy your development!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
