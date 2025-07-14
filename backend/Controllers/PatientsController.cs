using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/patients")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IExamsService _examsService;

        public PatientsController(IExamsService examsService)
        {
            _examsService = examsService ?? throw new ArgumentNullException(nameof(examsService));
            Console.WriteLine("PatientsController initialized.");
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            Console.WriteLine("GetAllPatients called.");
            try
            {
                var patients = await _examsService.GetAllPatientsAsync();
                Console.WriteLine($"Retrieved {patients?.Count ?? 0} patients.");
                return Ok(patients);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in GetAllPatients: {ex}");
                return StatusCode(500, "An unexpected error occurred while retrieving patients.");
            }
        }
    }
}