const request = require('supertest');
const express = require('express');
const routes = require("../routes");
const httpMocks = require('node-mocks-http');

const cors = require("cors");

const app = express();
app.use(
    cors({
        origin: "*",
    })
);

function buildMockReq(options) {
    return httpMocks.createRequest(options);
}

function buildMockRes() {
    const res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
    });
    return res;
}

describe('Route Handler Tests', () => {

    test('Fantasy Insights', async () => {
        const req = buildMockReq({
            method: 'GET',
            url: '/fantasy_insights',
        });
        const res = buildMockRes();

        await routes.fantasy_insights(req, res);
    }, 70000);

    test('Player Info', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/player_info/fred/evans',
        });
        const res = buildMockRes();

        await routes.player_info(req, res);
    }, 70000);

    test('Weather Insights', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/weather_insights/1970-09-20/BOS',
        });
        const res = buildMockRes();

        await routes.weather_insights(req, res);
    }, 70000);

    test('Match Predictions', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/match_predictions/OAK/PHI',
            params: {
                first_name: 'john',
                last_name: 'doe'
            }
        });
        const res = buildMockRes();

        await routes.match_predictions(req, res);
    }, 70000);

    test('Player Comparison', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/player_comparison/Aaron/Wallace/Travis/Kelce',
        });
        const res = buildMockRes();

        await routes.player_comparison(req, res);
    }, 70000);

    test('Player Comparison Games', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/player_comparison_games/Travis/Kelce/Tom/Brady',
        });
        const res = buildMockRes();

        await routes.player_comparison_games(req, res);
    }, 70000);

    test('Game Table', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/game_table',
        });
        const res = buildMockRes();

        await routes.game_table(req, res);
    }, 700000);

    test('Game History', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/game_history/SD/OAK/1995-09-03',
        });
        const res = buildMockRes();

        await routes.game_history(req, res);
    }, 70000);

    test('Player Database', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/player_database/Travis/Kelce',
        });
        const res = buildMockRes();

        await routes.player_database(req, res);
    }, 70000);

    test('Teammates', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/teammates',
        });
        const res = buildMockRes();

        await routes.teammates(req, res);
    }, 70000);

    test('Player Historical Opponents', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/player_historical_opponents',
        });
        const res = buildMockRes();

        await routes.player_historical_opponents(req, res);
    }, 70000);

    test('Weather Insights Head/Head', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/weather_insights_teams_head_to_head',
        });
        const res = buildMockRes();

        await routes.weather_insights_teams_head_to_head(req, res);
    }, 70000);

    test('Player Comparison', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/player_comparison_with_weather_log',
        });
        const res = buildMockRes();

        await routes.player_comparison_with_weather_log(req, res);
    }, 70000);

    test('Connections', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/connections',
        });
        const res = buildMockRes();

        await routes.connections(req, res);
    }, 70000);

    test('Contributors', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/contributors',
        });
        const res = buildMockRes();

        await routes.contributors(req, res);
    }, 70000);

    test('Teams', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/teams',
        });
        const res = buildMockRes();

        await routes.teams(req, res);
    }, 70000);

    test('Game landing page', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/game_landing_page',
        });
        const res = buildMockRes();

        await routes.teams(req, res);
    }, 70000);

    test('Player landing page', async () => {
        // Call the route handler
        const req = buildMockReq({
            method: 'GET',
            url: '/player_data_landing_page',
        });
        const res = buildMockRes();

        await routes.teams(req, res);
    }, 70000);
});