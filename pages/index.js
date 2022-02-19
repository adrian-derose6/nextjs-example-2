import Head from 'next/head';
import { Fragment } from 'react';

import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

const DUMMY_MEETUPS = [
	{
		id: 'm1',
		title: 'A First Meetup',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
		address: 'Some address 5, 12345 Some City',
		description: 'This is a first meetup!',
	},
	{
		id: 'm2',
		title: 'A Second Meetup',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
		address: 'Some address 5, 12345 Some City',
		description: 'This is a second meetup!',
	},
];

function HomePage(props) {
	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name='description'
					content='Browse a huge list of highly active React meetups!'
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	);
}

/* export async function getServerSideProps(context) {
	const req = context.req;
	const res = context.res;

	// fetch data
	return {
		props: {
			meetups: DUMMY_MEETUPS,
		},
	};
} */

export async function getStaticProps() {
	// fetch data from API
	const client = await MongoClient.connect(
		'mongodb+srv://adrian_d6:tecate6698@cluster0.3hdpc.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();
	// Always return object
	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 10,
	};
}

export default HomePage;
