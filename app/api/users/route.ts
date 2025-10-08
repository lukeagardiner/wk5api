//app/api/users/route.tsx
import { NextResponse } from 'next/server';
import { User } from '../../types/user';

let users: User[] = [];
let nextUserId = 1; // Initialise user Id counter

// Helper function to find a user by Id
function findUser(id: number) {
    return users.find((user) => user.id === id);
}

// GET route: Fetch all users or a specific user by Id
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('id'); // Check if there's an 'id' in the query string

        if (userId) {
            // If an 'id' is present, return the specific user
            const user = findUser(parseInt(userId));
            if(!user) {
                //return new NextResponse('User not found', { status: 404 });
                return new Response(JSON.stringify({ error: 'User not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                  });
            }
            return NextResponse.json(users);
        }
    } catch (error) {
        console.error('Error in GET request:', error);
        //return new NextResponse('Internal Server Error', { status: 500 });
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
    }
}

// POST route: Create a new user
export async function POST(request: Request) {
    try {
        // Parse incoming request body
        const { name, onlineStatus }: { name: string; onlineStatus: 'online' | 'offline' } = await request.json();
        console.log('Received data:', { name, onlineStatus });

        // Ensure required fields are present
        if (!name) {
            //return new NextResponse('User name is required', { status: 400 });
            return new Response(JSON.stringify({ error: 'User name is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
            
        }
        if (!onlineStatus) {
            //return new NextResponse('Online status is required', { status: 400 });
            return new Response(JSON.stringify({ error: 'Online status is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Create a new user object
        const newUser: User = {
            id: users.length, // Increment the user Id
            name: name,
            onlineStatus: onlineStatus,
        };

        console.log('New user object:', newUser)

        // Add the new user to the users array
        users.push(newUser);
        console.log('Updated users array:', users);

        // Return the newly created user object in the reponse
        //return NextResponse.json(newUser, { status: 201 });
        return new Response(JSON.stringify(newUser), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
        
    } catch (error) {
        console.error('Error in POST request:', error);
        //return new NextResponse('Invalid request body', { status: 400 });
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Patch route: Update a user's details
export async function PATCH(request: Request) {
    try {
        const url = new URL(request.url); // Get the request URL
        const userId = parseInt(url.searchParams.get('id')!); // Get the 'id' from the query string

        // Parse the JSON body to get the new name and onlineStatus
        const { name, onlineStatus } = await request.json();
        
        console.log("Received Id:", userId, "Name:", name, "Online Status:", onlineStatus);

        // Find the user in the array by Id
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
            //return new NextResponse('User not found', { status: 404 });
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Update user's details
        users[userIndex] = {...users[userIndex], name, onlineStatus };
        return NextResponse.json(users[userIndex]);
    } catch (error) {
        console.error("Error in PATCH request:", error);
        //return new NextResponse('Invalid request body', {status: 400});
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// DELETE route: Remove a user by Id
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url); // Get the request URL
        const userId = parseInt(url.searchParams.get('id')!); // Get the 'id' from the query string

        // Keep the length of the array for comparison
        const initialLength = users.length;

        // Remove the user by Id
        users = users.filter((user) => user.id !== userId);

        if (users.length === initialLength) {
            //return new NextResponse('User not found', { status: 404});
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        //return new NextResponse(null, { status: 204 }); // No content on successful deletion
        return new Response(JSON.stringify(null), {
            status: 204,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error in DELETE request:", error);
        //return new NextResponse('Invalid request body', { status: 400 });
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}